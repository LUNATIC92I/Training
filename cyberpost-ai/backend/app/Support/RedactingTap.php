<?php

namespace App\Support;

use Illuminate\Log\Logger;
use Monolog\LogRecord;

/** « tap » Monolog appliquant Redactor à tous les messages journalisés. */
class RedactingTap
{
    public function __invoke(Logger $logger): void
    {
        $logger->pushProcessor(function (LogRecord $record): LogRecord {
            return $record->with(
                message: Redactor::redact($record->message),
                context: Redactor::redactArray($record->context),
            );
        });
    }
}
