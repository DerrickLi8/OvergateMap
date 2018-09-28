<?php

include 'backend.php';
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
    return $or["totalNumberOut"];
    $fin = $r["totalNumberIn"] - $or["totalNumberOut"];
    return $fin; 
}

//get storeID based on storeName
function storesGetIDByName($storeName, $floor){
    $r = getWithStoredProcedure("call storesGetIDByName('$storeName', $floor);", array("StoreID"));
    return $r["StoreID"];
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

//function for calculating the people density of the given store
//the result would only keep 2 digits after the decimal point and return as a String  
function getPeopleDensityByStoreID($storeID){		
	$getStore_array = array('StoreName', 'StoreID','PeopleNumber','Area');	
	$store = getWithStoredProcedure("call storesSelectByID($storeID);", $getStore_array);		
	$peopleDensity = $store['PeopleNumber'] / $store['Area'];	
	$peopleDensity = number_format((float)$peopleDensity, 2, '.', '');				
	return $peopleDensity;
}

//function for calculating the people density of the given floor
//the result would only keep 2 digits after the decimal point and return as a String 
function getPeopleDensityByFloor($floor){
	$con = openConnection();
	$query="call storesSelectByFloor($floor);"; 
	$stmt = $con->prepare($query); 
	$stmt->execute(); 
	$result = $stmt->fetchAll(); 	
	$peopleNumber = 0;
	$totalArea = 0;
	
	foreach( $result as $row ) { 
		$peopleNumber = $peopleNumber + $row['PeopleNumber'];
		$totalArea = $totalArea + $row['Area'];
	}		
	closeConnection($result, $stmt, $con);
	$peopleDensity = $peopleNumber / $totalArea;
	$peopleDensity = number_format((float)$peopleDensity, 2, '.', '');		
	return $peopleDensity;
}

function getStoreTable(){
    $con = openConnection();
	$query="select * from stores"; 
	$stmt = $con->prepare($query); 
	$stmt->execute(); 
	$result = $stmt->fetchAll(); 	
    $jsonArray = array();
    foreach($result as $row){
        $jsonData['storeID'] = $row['StoreID'];
        $jsonData['storeName'] = $row['StoreName'];
        $jsonData['storeArea'] = $row['Area'];
        $jsonData['storeFloor'] = $row['UpDown'];
        $jsonData['storeCurPopulation'] = $row['CurrentPopulation'];
        $jsonData['storeTotPopulation'] = $row['TotalPopulation'];
        $jsonData['storePopulationDensity'] = $row['PopulationDensity'];

        array_push($jsonArray,$jsonData);
    }
	closeConnection($result, $stmt, $con);	
	return json_encode($jsonArray);
}

function getStoreHistory($storeID, $d){
    $r = getWithStoredProcedure("call getStoreHistory($storeID, '$d');", array("TotalPeopleIn"));
    return $r;
}

//choose what function to call and what to return based on the data passed in

switch($funct){
    case 'storeTrackerForDay':
    $d = $_POST['date'];
    $storeID = $_POST['storeID'];
    $result = storeTrackerForDay($storeID, $d);
    break;

    case 'overgatePerDay':
    $d = $_POST['date'];
    $result = overgatePerDay($d);
    break;

    case 'overgateTotal':
    $result = overgateTotal();
    break;

    case 'storeTrackerTotal':
    $storeID = $_POST['storeID'];
    $result = storeTrackerTotal($storeID);
    break; 
    
    case 'storesGetIDByName':
    $name = $_POST['name'];
    $floor = $_POST['floor'];
    $result = storesGetIDByName($name, $floor);
    break;

    case 'getPeopleDensityByStoreID':
    $storeID = $_POST['storeID'];
    $result = getPeopleDensityByStoreID($storeID);
    break;

    case 'getPeopleDenstiyByFloor':
    $floor = $_POST['floor'];
    $result = getPeopleDensityByFloor($floor);
    break;

    case 'getStoreTable':
    $result = getStoreTable();
    break;

    case 'getStoreHistory':
    $d = $_POST['date'];
    $storeID = $_POST['storeID'];
    $result = getStoreHistory($storeID, $d);
    break;
}

$array = array('result'=>$result);
echo $array["result"];
?>