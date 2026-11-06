<?php

use App\Http\Middleware\EnsureOwner;
use App\Http\Middleware\RequireHttps;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->trustProxies(at: env('TRUSTED_PROXIES', '127.0.0.1'));
        $middleware->prepend(RequireHttps::class);
        $middleware->alias(['owner' => EnsureOwner::class]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Réponses JSON homogènes, en français, sans fuite d'informations internes.
        $exceptions->shouldRenderJsonWhen(fn (Request $r) => $r->is('api/*') || $r->expectsJson());
        $exceptions->render(function (Throwable $e, Request $r) {
            if (! ($r->is('api/*') || $r->expectsJson())) {
                return null;
            }
            return match (true) {
                $e instanceof ValidationException => response()->json(['message' => collect($e->errors())->flatten()->first() ?? 'Données invalides.', 'errors' => $e->errors()], 422),
                $e instanceof AuthenticationException => response()->json(['message' => 'Authentification requise.'], 401),
                $e instanceof ThrottleRequestsException => response()->json(['message' => 'Trop de requêtes : réessayez dans un instant.'], 429),
                $e instanceof ModelNotFoundException, $e instanceof NotFoundHttpException => response()->json(['message' => 'Ressource introuvable.'], 404),
                $e instanceof HttpExceptionInterface => response()->json(['message' => $e->getMessage() ?: 'Requête refusée.'], $e->getStatusCode()),
                default => config('app.debug') ? null : response()->json(['message' => 'Erreur interne du serveur.'], 500),
            };
        });
    })->create();
