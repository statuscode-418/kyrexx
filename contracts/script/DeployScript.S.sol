import {Script, console} from "forge-std/Script.sol";
import {hook} from "../src/hooks/hook.sol";
import {AppealContract} from "../src/main/AppealContract.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();

        hook hookContract = new hook();
        console.log("Hook contract deployed at:", address(hookContract));

        AppealContract appealContract = new AppealContract(
            address(hookContract)
        );
        console.log("AppealContract deployed at:", address(appealContract));

        vm.stopBroadcast();
    }
}
