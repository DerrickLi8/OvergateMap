<?php
include 'backend.php';
$funct = $_GET['funct'];


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
    
    case 'storeTrackerCreate':
    $inOrOut = $_GET['inOrOut'];
    $storeID = $_GET['storeID'];
    $result = storeTrackerCreate($inOrOut, $storeID);
    break;
}
$array = array('result'=>$result);
echo $array["result"];
?>