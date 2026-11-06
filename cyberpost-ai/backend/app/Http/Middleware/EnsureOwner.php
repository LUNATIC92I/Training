<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

/** Actions de modification réservées au rôle « owner » (le rôle « viewer » est en lecture seule). */
class EnsureOwner
{
    public function handle(Request $request, Closure $next)
    {
        if (! $request->user()?->isOwner()) {
            return response()->json(['message' => 'Action réservée au propriétaire du compte.'], 403);
        }
        return $next($request);
    }
}
