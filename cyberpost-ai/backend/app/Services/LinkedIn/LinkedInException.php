<?php

namespace App\Services\LinkedIn;

use RuntimeException;

class LinkedInException extends RuntimeException
{
    public function __construct(string $message, public readonly ?int $status = null)
    {
        parent::__construct($message);
    }
}
