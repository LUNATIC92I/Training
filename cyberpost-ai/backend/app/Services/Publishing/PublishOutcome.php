<?php

namespace App\Services\Publishing;

final class PublishOutcome
{
    public function __construct(public readonly bool $ok, public readonly string $message, public readonly string $code = '') {}
}
