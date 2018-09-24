<!DOCTYPE html>
<html>
<body>

<?php

//header('Content-Type: application/json');
include 'backend.php';
//$_POST = json_decode(file_get_contents('php://input'), true);
$storeID = $_POST['storeID'];
$d = $_POST['date'];
$funct = $_POST['function'];

//calculate people at store for a day
function storeTrackerForDay($storeID, $d){
	try{
		$r = getWithStoredProcedure("call storeTrackerGetInForDay($storeID, '$d');", array("totalNumberInForDay"));
		$or = getWithStoredProcedure("call storeTrackerGetOutForDay($storeID, '$d');", array("totalNumberOutForDay"));
		$fin = $r["totalNumberInForDay"] - $or["totalNumberOutForDay"];
		//$to_return = new stdClass();
		//$to_return->numberInStore = $fin;
		//return json_encode($to_return);
		return $fin+3;
    }
    catch(PDOException $e)
        {
            echo "error: ".$e->getMessage();
        }
}

if ($funct == 'storeTrackerForDay'){
	$result = storeTrackerForDay($storeID, $d);
	echo $result;
} 
//if (isset($_POST['storeTrackerForDay'])) {
//        echo storeTrackerForDay($_POST['storeTrackerForDay']);
//    }


//$id = $_GET['id'];
//storeTrackerForDay($id, "2018-09-13");



?>