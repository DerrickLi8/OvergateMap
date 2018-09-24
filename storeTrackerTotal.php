<!DOCTYPE html>
<html>
<body>

<?php
include 'backend.php';

//calculate people at store(total)
function storeTrackerTotal($storeID){
    $r = getWithStoredProcedure("call storeTrackerGetInTotal($storeID);", array("totalNumberIn"));
    $or = getWithStoredProcedure("call storeTrackerGetOutTotal($storeID);", array("totalNumberOut"));
    $fin = $r["totalNumberIn"] - $or["totalNumberOut"];
    $to_return = new stdClass();
    $to_return->peopleNumber = $fin;
    return json_encode($to_return);
    }
    catch(PDOException $e)
        {
            echo "error: ".$e->getMessage();
        }
}

$t = storeTrackerTotal(2);
echo "test(storeTrackerTotal)";
var_dump($t);
echo "<br>";

?>