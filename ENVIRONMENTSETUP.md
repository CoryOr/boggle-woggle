# Local Environment Setup
### Prerequisites
1. Docker Desktop installed
2. MySQL Workbench installed

### Starting DB, Frontend, and Backend
1. Start Docker Desktop
2. Click run on project_3c:
   1. If you do not see this in Docker Desktop, see the section titled "Generating project_3c Container"

![alt text](markdown_images/img0.png)

3. Update your .env file to use local environment variables
4. From the Project_3c root folder, cd into the backend folder
   1. Type ./gradlew bootRun in the terminal and press enter to start the backend on localhost:8080
5. From a new terminal window, navigate to Project_3c root folder and cd into the frontend folder
   1. Type npm run dev in the terminal and press enter to start the frontend on localhost:3000

### See Database Changes
1. Open MySQL Workbench
2. Click on boggle_db connection
   1. If you do not see this connection, see the section titled "Connecting to boggle_db"

![alt text](markdown_images/img1.png)

3. Create a new SQL script

![img.png](markdown_images/img2.png)

4. Run "USE boggle_db;" and click on the lightning icon

![img.png](markdown_images/img3.png)

   1. On success, you should see a check mark in the bottom pane
   2. From this point, you can query the tables like normal
   3. To see a list of tables, use the query "SHOW TABLES;"

# Known Issues
### Generating project_3c Container
- If you do not see project_3c container in Docker desktop, navigate in your terminal to the Project_3c root directory
- Once here, run "docker compose up". (If this doesn't work, you probably don't have Docker Desktop open)
  - This will create project_3c for you in Docker Desktop and automatically run the container
  - When you are finished using the container for your development session, you can press the stop button to stop running the container
  - On future local development sessions, you now can follow the same process of running the project_3c container as detailed in the "Setup" section of this file
- If you ever lose the project_3c container, you can always run docker compose up from the Project_3c root directory again to regenerate it

### Connecting to boggle_db
- If you don't have any MySQL Connections in MySQL workbench, follow the steps in this section

![img.png](markdown_images/img4.png)

1. Click the plus icon to create a new connection

![img.png](markdown_images/img5.png)

2. Enter the following info into the popup window

![img.png](markdown_images/img6.png)

3. Click on the "Store in Vault ..."
   1. The password is "secret" with no quotes
4. Click "OK" after entering the password and then click "OK" again to finish the connection setup



# Running Backend, Frontend With University VM Hosted DB
1. Update your .env file to use the correct password. Note: All other values are the same. Only the password needs changed.
2. Establish an ssh tunnel
   1. In a new terminal, type in "ssh -L 3306:localhost:3306 <your_cs_login>@cs506x3c.cs.wisc.edu"
3. Navigate to the Project_3c folder and cd into the backend folder
    1. Run ./gradlew bootRun to start up the backend on localhost:8080
4. Navigate to the Project_3c folder in a new terminal session and cd into the frontend folder
    1. Run npm run dev to start up the frontend on localhost:3000

### See Database Changes
1. On the university vm, enter this command: "docker exec -it boggle-mysql-db mysql -u root -p<password_from_env_file>". Note that there is no space after the -p flag. If you add a space you will get an error
2. If this was successful, you should see a "mysql>" prompt. At this point, type in "use boggle_db;". Then you can type sql queries like normal. For a list of tables, use "show tables;"


### Known Issues
- If you try to run the "docker exec -it boggle-mysql-db mysql -u root -p<password_from_env_file>" command and get the response: "Error response from daemon: container <some_long_string> is not running", it means that the docker container is not running.
  - Run docker container ps to verify. If boggle-mysql-db isn't listed, the container was stopped.
  - Run "docker compose up -d" in the same directory that has docker-compose.yml to recreate the container and get it running