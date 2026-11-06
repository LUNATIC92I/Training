<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

/** HTTPS obligatoire en production (derrière un proxy, voir TRUSTED_PROXIES). */
class RequireHttps
{
    public function handle(Request $request, Closure $next)
    {
        if (app()->isProduction() && ! $request->secure()) {
            return response()->json(['message' => 'HTTPS obligatoire.'], 403);
        }
        $response = $next($request);
        if (app()->isProduction()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('Referrer-Policy', 'no-referrer');
        return $response;
    }
}
