<!DOCTYPE html>
<html>
<body>

<?php
include 'backend.php';

//function to calculate people number at overgate a day
//enter record(storeTracker)
function storeTrackerEnterRecord($inOrOut, $storeID){
    try{
        setWithStoredProcedure("call storeTrackerEnterRecord($inOrOut, $storeID);");
    }
    catch(PDOException $e)
    {
        echo "error: ".$e->getMessage();
    }
}

storeTrackerEnterRecord(0, 1);
echo "<br>";

?>