<?php

use App\Http\Controllers\Api\LinkedInController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => response()->json(['service' => 'CyberPost AI', 'api' => '/api/v1']));

// URL de redirection OAuth à déclarer dans le LinkedIn Developer Portal (LINKEDIN_REDIRECT_URI).
Route::get('/linkedin/callback', [LinkedInController::class, 'callback'])->middleware('throttle:20,1')->name('linkedin.callback');
