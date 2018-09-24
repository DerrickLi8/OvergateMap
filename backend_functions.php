<?php

include 'backend.php';
$storeID = $_POST['storeID'];
$d = $_POST['date'];
$funct = $_POST['funct'];

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

//choose what function to call and what to return based on the data passed in

switch($funct){
    case 'storeTrackerForDay':
    $result = storeTrackerForDay($storeID, $d);
    break;

    case 'overgatePerDay':
    $result = overgatePerDay($d);
    break;

    case 'overgateTotal':
    $result = overgateTotal();
    break;

    case 'storeTrackerTotal':
    $result = storeTrackerTotal($storeID);
    break;    

}   

$array = array('result'=>$result);
echo $array["result"];
?>