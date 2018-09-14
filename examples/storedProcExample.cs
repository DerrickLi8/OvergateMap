public int storesCreate(string storeName, int upDown)
        {
            //assign stored procedure, use procedure name from database
            string storedProc = "``storesCreate``;";

            //open connection
            MySqlConnection connection = new MySqlConnection(ConnectionClass.ConnectionString);
            connection.Open();

            //define stored procedure
            MySqlCommand cmd = new MySqlCommand(storedProc, connection);
            cmd.CommandType = System.Data.CommandType.StoredProcedure;

            //assign parameters - ?storedProcedureParameter, dataToEnter
            cmd.Parameters.Add(new MySqlParameter("?storeName", storeName));

            //execute procedure
            int i = cmd.ExecuteNonQuery();

            //close connection and return number of rows affected (should be 1)
            connection.Close();
            
            return i;
}