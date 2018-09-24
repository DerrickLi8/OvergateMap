<!DOCTYPE html>
<html>
<body>

<?php
include 'backend.php';

//function to calculate people number at overgate a day
function overgatePerDay($d){
    try{
        $r = getWithStoredProcedure("call overgateGetInForDay('$d');", array('NumberOfIn'));
        $or = getWithStoredProcedure("call overgateGetOutForDay('$d');", array('NumberOfOut'));
        $fin = $r["NumberOfIn"] - $or["NumberOfOut"];
        $to_return = new stdClass();
        $to_return->peopleNumber = $fin;
        return json_encode($to_return);
    }
    catch(PDOException $e)
        {
            echo "error: ".$e->getMessage();
        }
}

$t = overgatePerDay("2018-09-13");
echo "test (overgatePerDay)";
var_dump ($t);
echo "<br>";

?>