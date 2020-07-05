<?php
//seconds - seconds
//minutes - minutes
//hours - hours
//mday - numeric day of the month
//wday - numeric day of the week (0 as Sunday through 6 as Saturday)
//mon - numeric month
//year - numeric year
//yday - numeric day of the year, ie 299
//weekday - day of the week, ie Friday
//month - month, ie January
$today = getdate();
$seconds = $today["seconds"];
$minutes = $today["minutes"];
$hours = $today["hours"];
$mday = $today["mday"];
$wday = $today["wday"];
$mon = $today["mon"];
$year = $today["year"];
$yday = $today["yday"];
$weekday = $today["weekday"];
$month = $today["month"];
echo $year." Brian McKee";
?>