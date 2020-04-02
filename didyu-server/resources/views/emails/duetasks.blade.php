@component('mail::message')
# Introduction

Your task is due by {{ $no_of_due_days }}.

@component('mail::button', ['url' => ''])
Button Text
@endcomponent

Thanks,<br>
{{ config('app.name') }} 
@endcomponent
