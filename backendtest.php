<!DOCTYPE html>
<html>
<body>

<?php
include 'db.php';

//function to open connection to access db
function openConnection(){
    try{
        $conn = connect();
    }
    catch(PDOException $e)
    {
        echo "error: ".$e->getMessage();
    }
    return $conn;
}

function closeConnection($q, $stmt, $conn){
    $q = null;
    $stmt = null;
    $conn = null;
}

function closeConnectionForSet($stmt, $conn){
    $stmt = null;
    $conn = null;
}

//functions for handling database through stored procedures

function setWithStoredProcedure($proc){  
    try{
        $con = openConnection();
        $stmt = $con->prepare($proc);
        $stmt->execute();
        echo "success";
        closeConnectionForSet($stmt, $con);
        }
    catch(PDOException $e)
        {
            echo "error: ".$e->getMessage();
        }
}

function getWithStoredProcedure($proc, $input){
    try{
        $con = openConnection();
        $stmt = $con->prepare($proc, array(':input'));
        $stmt->bindParam(':input', $input, PDO::PARAM_STR);
        $stmt->execute();
        $r = $stmt->fetchAll();
        $to_return = array();
        foreach($r as $res){
            //var_dump($res);
                if(array_key_exists($input, $res)){
                    $to_return[$key] = $res[$key];
                }
            }
        
        return $to_return;
    closeConnection($r, $stmt, $con);
    }
    catch(PDOException $e)
    {
        echo "error: ".$e->getMessage();
    }
}

//calculate the people number at overgate per day
function overgatePerDay($d){
    $r = getWithStoredProcedure("call overgateGetInForDay('$d');", array('NumberOfIn'));
    $or = getWithStoredProcedure("call overgateGetOutForDay('$d');", array('NumberOfOut'));
    $fin = $r["NumberOfIn"] - $or["NumberOfOut"];
    return $fin;
}

//calculate total people at overgate
function overgateTotal(){
    $r = getWithStoredProcedure("call overgateComplexGetInTotal();", array('NumberOfIn'));
    $or = getWithStoredProcedure("call overgateComplexGetOutTotal();", array('NumberOfOut'));
    $fin = $r["NumberOfIn"] - $or["NumberOfOut"];
    return $fin;
}

//calculate people at store for a day
function storeTrackerForDay($storeID, $d){
    $r = getWithStoredProcedure("call storeTrackerGetInForDay($storeID, '$d');", array("totalNumberInForDay"));
    $or = getWithStoredProcedure("call storeTrackerGetOutForDay($storeID, '$d');", array("totalNumberOutForDay"));
    $fin = $r["totalNumberInForDay"] - $or["totalNumberOutForDay"];
    return $fin; 
}

//calculate people at store(total)
function storeTrackerTotal($storeID){
    $r = getWithStoredProcedure("call storeTrackerGetInTotal($storeID);", array("totalNumberIn"));
    $or = getWithStoredProcedure("call storeTrackerGetOutTotal($storeID);", array("totalNumberOut"));
    $fin = $r["totalNumberIn"] - $or["totalNumberOut"];
    return $fin; 
}

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
    
function storesGetIDByName($storeName, $floor){
    $r = getWithStoredProcedure("call storesGetIDByName($storeName, $floor);", "StoreID");
    return $r["StoreID"];
}  


//enter record(overgate complex)
function storeTrackerCreate($inOrOut, $storeID){
    $date = date("Y-m-d");
    $time = date("H:i:s");
    try{
        setWithStoredProcedure("call storeTrackerCreate('$time', '$date', $inOrOut, $storeID);");
        return("succcc");
    }
    catch(PDOException $e)
    {
        echo "error: ".$e->getMessage();
    }
}

/*
--------------tests here------------------
*/

//test for overgatePerDay
//$t = overgatePerDay("2018-09-13");
//echo "test (overgatePerDay)";
//var_dump ($t);
//echo "<br>";

//test for overgateTotal
//$t = overgateTotal();
//echo "test(overgateTotal)";
//var_dump($t);
//echo "<br>";

//test for storeTrackerForDay
//$t = storeTrackerForDay(1, "2018-09-13");
//echo "test(storeTrackerForDay)";
//var_dump($t);
//echo "<br>";

//test for storeTrackerTotal
//$t = storeTrackerTotal(2);
//echo "test(storeTrackerTotal)";
//var_dump($t);
//echo "<br>";

//test for overgateComplexEnterRecord
//overgateComplexEnterRecord(1);
//echo "<br>";
//overgateComplexEnterRecord(0);
//echo "<br>";
//test for
//storeTrackerEnterRecord(0, 1);
//echo "<br>";

//test for getting the ID
$t = storeTrackerCreate(0, 1);
echo "test(storesTrackerCreate)";
var_dump($t);
echo "<br>";








//

?>

</body>
</html> 