import { Link } from "expo-router";
import { SafeAreaView, Text, View } from "react-native";

export default function account() {

    return (
        <SafeAreaView>
            <Text>
                Account
            </Text>

            <Link href={"/accountInfo"}>
                go to account Info
            </Link>
            
        </SafeAreaView>
    );
}