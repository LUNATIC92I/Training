<?php

namespace App\Services\Llm;

use RuntimeException;

class LlmException extends RuntimeException
{
    public function __construct(string $message, public readonly bool $retryable = true)
    {
        parent::__construct($message);
    }
}
