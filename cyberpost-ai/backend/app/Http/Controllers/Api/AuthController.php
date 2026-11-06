<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', 'string', 'max:255'],
            'device_name' => ['required', 'string', 'max:100'],
        ]);
        $user = User::where('email', strtolower($data['email']))->first();
        // Vérification systématique du hachage pour ne pas révéler l'existence du compte par le temps de réponse.
        if ($user) {
            $valid = Hash::check($data['password'], $user->password);
        } else {
            Hash::make($data['password']); // coût équivalent à une vérification
            $valid = false;
        }
        if (! $user || ! $valid) {
            return response()->json(['message' => 'Identifiants incorrects.'], 422);
        }
        // Jetons d'API valables 90 jours ; un seul jeton par appareil.
        $user->tokens()->where('name', $data['device_name'])->delete();
        $token = $user->createToken($data['device_name'], ['*'], now()->addDays(90))->plainTextToken;
        return response()->json(['token' => $token, 'user' => $this->user($user)]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();
        return response()->json(['ok' => true, 'message' => 'Déconnecté.']);
    }

    public function me(Request $request)
    {
        return response()->json(['data' => $this->user($request->user())]);
    }

    private function user(User $u): array
    {
        return ['id' => $u->id, 'name' => $u->name, 'email' => $u->email, 'role' => $u->role];
    }
}
