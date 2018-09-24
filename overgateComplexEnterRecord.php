<!DOCTYPE html>
<html>
<body>

<?php
include 'backend.php';

//enter record(overgate complex)
function overgateComplexEnterRecord($inOrOut){
    try{
        setWithStoredProcedure("call overgateComplexEnterRecord($inOrOut);");
    }
    catch(PDOException $e)
        {
            echo "error: ".$e->getMessage();
        }
}

//test for overgateComplexEnterRecord
overgateComplexEnterRecord(1);
echo "<br>";
overgateComplexEnterRecord(0);
echo "<br>";

?>