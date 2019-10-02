@component('mail::message')
# Introduction

<h1>Task Reminder</h2>
<p>{{ $task->title }}</p>

@component('mail::button', ['url' => ''])
Button Text
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
