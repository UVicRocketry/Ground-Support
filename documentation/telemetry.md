# Ground Support Telemetry

## Overview
![image](https://github.com/UVicRocketry/Ground-Support/assets/79673714/4d12a609-4c14-40fd-9f79-fe8ffff7273d)

The Telemetry Backend implementation runs a socket server as well as a receiving and decoding thread. The decoding thread receives incoming encoded data from the rtl-sdr and decodes and packages it. Once data has been processed, the socket server will send data over sockets to the front end. Front end can also send a message to the socket server to prompt it to change receiving settings. This could include a change in encoding type (APRS, LORA) or other changes such as frequency. Socket sever will cause receiving thread to change its settings and run as usual.

## How to Run

### Running RTL-FM and Direwolf
1. Plug in RTL-SDR to The PC.
2. Edit telemtry.py to make desired API call.
3. Set up Big Red Bee to transmit on a certain frequency.
4. Make sure Big Red Bee is transmitting using a receiving software on the PC. I used
   [SDR Sharp](https://airspy.com/download/) and that worked well. Just download the program and run both .bat files, then start the application.
5. Open WSL instance and navigate `Ground-Support`
6. Navigate to `services/telemetry/tools`
7. Run following command. This will receive and decode signals and print output to terminal, so debugging can be done.
\
@JackCotter - double check this command
    ```bash 
    rtl_fm -f 441.35M -r 24k -s 260k -o 4 -p 93 -g 49.6 - | direwolf -n > 1 -r 24000 -b 16 -
    ```

9. Go outside and wait for telemetry lock (~3mins). When Telemetry is locked on output will look like what is seen on
   the right terminal. When Telemetry is not locked on, output will resemble the left terminal.
   ![image](https://user-images.githubusercontent.com/79673714/222917125-9d559bdc-36c3-4ad0-939d-dfd5df27c956.png)
10. Once Telemetry is locked, quit the previous command with ^C and input the 
11. **smiles*\*! "No way it's working perfectly!"

### Run for Development
@JackCotter Create a list of steps to run the telemetry solely in the rust environment


### Run for production
@JackCotter Create a list of steps to run the telemetry and connect the application containers

## Architecture
The telemetry module is split into two main components: the socket server and the receiving and decoding thread. 

### Socket Server
The socket server is the main communication hub for the telemetry module. Telemetry data is sent through this server to the front end once it has been decoded and received through the Decoding Thread. The front end can also communicate with the socket server to change receiver settings such as encoding type and frequency. 

### Receiving and Decoding Thread
The receiving and decoding thread is spawned by the socket server, and is used to receive and decode telemetry data sent from the rocket using an RTL-SDR with RTL-FM and direwolf. Depending on the settings specified by the front end, the thread will listen on one frequency to one signal. Only compatible with RTL-SDR.

## Testing and Debugging

### Testing
@JackCotter explain how change into test mode (run `decode_test.sh` instead of `decode.sh`), also explain how to run built-in tests and rust client

### Debugging
@JackCotter explain things that commonly go wrong and how to fix them

## Known Issues

### ⚠️ Windows terminal buffering
Due to the way windows terminals buffer output through a pipe, the telemetry module will not output any data until the buffer is full. Unfortunately, there is no current fix for this issue. This was discovered during LC 2023 when python was used to run the telemetry module, in this configuration packets would no be piped into the python script until the buffer was full this happened to be after 3 packets were received. Unfortunately for us this was an issue with the windows terminal, therefore the rust implementation has the same issue.

This issue does not impact running direwolf and RTL-FM in a terminal outside of the telemetry module. **The issue only occurs when you try to pipe the output into a script**.

The solution to this issue is to run the telemetry module in a linux environment. Unfortunately, we cannot containerize this service in docker as it requires access to a usb port to communicate with the RTL-SDR. Best **solution** if you are running windows is to the **whole application in WSL2**. To do this run the server and client through its docker containers in your WSL2 instance and run the telemetry service. Since this design change to use WSL, all of the binaries for RTL-FM and direwolf are compiled for linux only. 

This issue is not present on linux or mac based systems.


