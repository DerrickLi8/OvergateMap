<!DOCTYPE html>
<html>
<body>

<?php
include 'backend.php';
//calculate total people at overgate
function overgateTotal(){
    try{
        $r = getWithStoredProcedure("call overgateComplexGetInTotal();", array('NumberOfIn'));
        $or = getWithStoredProcedure("call overgateComplexGetOutTotal();", array('NumberOfOut'));
        $fin = $r["NumberOfIn"] - $or["NumberOfOut"];
        $to_return = new stdClass();
        $to_return->totalNumber = $fin;
        return json_encode($to_return);
    }
    catch(PDOException $e)
        {
            echo "error: ".$e->getMessage();
        }
    
}

$t = overgateTotal();
echo "test(overgateTotal)";
var_dump($t);
echo "<br>";

?>