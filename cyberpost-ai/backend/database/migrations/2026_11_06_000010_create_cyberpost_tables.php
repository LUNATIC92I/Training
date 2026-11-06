<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Schéma métier de CyberPost AI.
 *
 * Garanties anti-doublon (voir docs/ARCHITECTURE.md) :
 *  - articles : unique(user_id, slot_date) -> un seul article automatique par jour ouvré ;
 *               unique(user_id, content_hash) -> jamais deux fois le même contenu ;
 *  - publications : unique(article_id) -> un article ne peut avoir qu'une publication ;
 *                   unique(linkedin_post_urn) et unique(idempotency_key).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('linkedin_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('member_id', 100);
            $table->string('person_urn', 150);
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->text('access_token');              // chiffré (cast "encrypted")
            $table->text('refresh_token')->nullable(); // chiffré, si LinkedIn en fournit
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('refresh_expires_at')->nullable();
            $table->string('scopes')->nullable();
            $table->string('status', 20)->default('connected'); // connected | expired | revoked
            $table->timestamp('connected_at')->nullable();
            $table->timestamp('last_verified_at')->nullable();
            $table->timestamp('expiry_warned_at')->nullable();
            $table->text('last_error')->nullable();
            $table->timestamps();
        });

        Schema::create('oauth_states', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('state_hash', 64)->unique();
            $table->timestamp('expires_at');
            $table->timestamp('used_at')->nullable();
            $table->timestamps();
        });

        Schema::create('editorial_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('slug', 60);
            $table->string('name', 120);
            $table->string('group', 80);
            $table->text('description')->nullable();
            $table->json('topics');
            $table->boolean('requires_sources')->default(false); // actualités : sources obligatoires
            $table->boolean('enabled')->default(true);
            $table->unsignedSmallInteger('weight')->default(1);
            $table->timestamp('last_used_at')->nullable();
            $table->timestamps();
            $table->unique(['user_id', 'slug']);
        });

        Schema::create('application_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('publish_time', 5)->default('06:30');
            $table->json('publish_days');                       // ISO : 1 = lundi … 7 = dimanche
            $table->string('timezone', 64)->default('Africa/Abidjan');
            $table->string('mode', 20)->default('automatic');   // automatic | validation
            $table->string('article_length', 20)->default('variable');
            $table->string('tone', 30)->default('pedagogue');
            $table->unsignedTinyInteger('hashtags_count')->default(5);
            $table->string('llm_provider', 40)->default('anthropic');
            $table->string('language', 5)->default('fr');
            $table->unsignedSmallInteger('generation_lead_minutes')->default(60);
            $table->unsignedSmallInteger('catch_up_window_minutes')->default(120);
            $table->string('author_name')->default('');
            $table->string('author_title')->default('');
            $table->string('author_domain', 500)->default('');
            $table->text('author_positioning')->nullable();
            $table->text('custom_instructions')->nullable();
            $table->timestamps();
        });

        Schema::create('publication_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('weekday');  // 1..7
            $table->json('category_slugs');
            $table->timestamps();
            $table->unique(['user_id', 'weekday']);
        });

        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('editorial_category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('topic', 255)->nullable();
            $table->string('angle', 120)->nullable();
            $table->string('title', 255);
            $table->text('content');
            $table->json('hashtags');
            $table->json('sources');
            $table->string('language', 5)->default('fr');
            $table->string('status', 30)->index();
            $table->unsignedTinyInteger('quality_score')->default(0);
            $table->json('quality_issues');
            $table->unsignedInteger('word_count')->default(0);
            $table->char('content_hash', 64)->nullable();
            $table->date('slot_date')->nullable();         // jour de publication automatique (fuseau de l'utilisateur)
            $table->timestamp('scheduled_for')->nullable()->index(); // UTC
            $table->timestamp('generated_at')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->string('linkedin_post_urn', 150)->nullable()->unique();
            $table->text('error')->nullable();
            $table->unsignedTinyInteger('generation_attempts')->default(0);
            $table->timestamp('next_generation_at')->nullable();
            $table->string('provider', 40)->nullable();
            $table->string('model', 100)->nullable();
            $table->timestamps();
            $table->unique(['user_id', 'slot_date']);
            $table->unique(['user_id', 'content_hash']);
        });

        Schema::create('publications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('article_id')->unique()->constrained()->cascadeOnDelete();
            $table->uuid('idempotency_key')->unique();
            $table->string('status', 30)->index(); // publishing | published | retry_scheduled | failed | uncertain
            $table->unsignedTinyInteger('attempts')->default(0);
            $table->timestamp('next_attempt_at')->nullable();
            $table->string('linkedin_post_urn', 150)->nullable()->unique();
            $table->unsignedSmallInteger('http_status')->nullable();
            $table->text('last_error')->nullable();
            $table->string('trigger', 20)->default('scheduler'); // scheduler | manual
            $table->timestamp('started_at')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type', 50);
            $table->string('title');
            $table->text('body');
            $table->string('level', 10)->default('info'); // success | info | warning | error
            $table->foreignId('article_id')->nullable()->constrained()->nullOnDelete();
            $table->string('dedupe_key', 120)->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamp('pushed_at')->nullable();
            $table->string('push_error')->nullable();
            $table->timestamps();
            $table->unique(['user_id', 'dedupe_key']);
        });

        Schema::create('publication_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('article_id')->nullable()->constrained()->nullOnDelete();
            $table->string('level', 10)->index();
            $table->string('event', 60)->index();
            $table->text('message');
            $table->json('context')->nullable();
            $table->timestamp('created_at')->useCurrent()->index();
        });

        Schema::create('device_tokens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('token', 500);
            $table->char('token_hash', 64)->unique();
            $table->string('platform', 20)->default('android');
            $table->timestamp('last_seen_at')->nullable();
            $table->timestamps();
        });

        Schema::create('system_heartbeats', function (Blueprint $table) {
            $table->string('name', 60)->primary();
            $table->timestamp('last_run_at')->nullable();
            $table->json('data')->nullable();
        });
    }

    public function down(): void
    {
        foreach (['system_heartbeats', 'device_tokens', 'publication_logs', 'notifications', 'publications', 'articles',
            'publication_schedules', 'application_settings', 'editorial_categories', 'oauth_states', 'linkedin_accounts'] as $t) {
            Schema::dropIfExists($t);
        }
    }
};
