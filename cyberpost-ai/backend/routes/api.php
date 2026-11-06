<?php

use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CalendarController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\LinkedInController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\SettingsController;
use Illuminate\Support\Facades\Route;

/*
| API REST CyberPost AI : préfixe /api/v1, JSON, authentification par jeton
| Sanctum (Authorization: Bearer). Voir docs/API.md.
*/

Route::prefix('v1')->group(function () {
    Route::get('health', fn () => response()->json(['ok' => true, 'time' => now()->toIso8601String()]));
    Route::post('auth/login', [AuthController::class, 'login'])->middleware('throttle:login');

    Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
        Route::get('dashboard', DashboardController::class);

        Route::get('articles', [ArticleController::class, 'index'])->name('articles.index');
        Route::get('articles/{id}', [ArticleController::class, 'show'])->whereNumber('id');
        Route::get('calendar', [CalendarController::class, 'show']);
        Route::get('categories', [CategoryController::class, 'index']);
        Route::get('settings', [SettingsController::class, 'show']);
        Route::get('providers', [SettingsController::class, 'providers']);
        Route::get('linkedin/status', [LinkedInController::class, 'status']);
        Route::get('notifications', [NotificationController::class, 'index']);
        Route::post('notifications/{id}/read', [NotificationController::class, 'read'])->whereNumber('id');
        Route::post('notifications/read-all', [NotificationController::class, 'readAll']);
        Route::post('devices', [NotificationController::class, 'registerDevice']);
        Route::delete('devices', [NotificationController::class, 'unregisterDevice']);
        Route::get('push-config', [NotificationController::class, 'pushConfig']);
        Route::get('logs', [NotificationController::class, 'logs']);

        // Actions de modification : rôle « owner » uniquement
        Route::middleware('owner')->group(function () {
            Route::put('articles/{id}', [ArticleController::class, 'update'])->whereNumber('id');
            Route::delete('articles/{id}', [ArticleController::class, 'destroy'])->whereNumber('id');
            Route::post('articles/generate', [ArticleController::class, 'generate'])->middleware('throttle:generation');
            Route::post('articles/{id}/regenerate', [ArticleController::class, 'regenerate'])->whereNumber('id')->middleware('throttle:generation');
            Route::post('articles/{id}/approve', [ArticleController::class, 'approve'])->whereNumber('id');
            Route::post('articles/{id}/publish-now', [ArticleController::class, 'publishNow'])->whereNumber('id')->middleware('throttle:publish');
            Route::post('articles/{id}/schedule', [ArticleController::class, 'schedule'])->whereNumber('id');
            Route::post('articles/{id}/resolve', [ArticleController::class, 'resolve'])->whereNumber('id');
            Route::put('calendar', [CalendarController::class, 'update']);
            Route::put('categories/{slug}', [CategoryController::class, 'update']);
            Route::put('settings', [SettingsController::class, 'update']);
            Route::post('linkedin/connect', [LinkedInController::class, 'connect']);
            Route::post('linkedin/disconnect', [LinkedInController::class, 'disconnect']);
        });
    });
});
