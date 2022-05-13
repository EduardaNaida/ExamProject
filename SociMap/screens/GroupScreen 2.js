import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { ScrollView, View, VirtualizedList } from "react-native";
import GroupView from "../Pages/GroupView";
import NewGroupView from "../Pages/NewGroupView";
import PersonsView from "../Pages/PersonsView";
import PersonScreen from "./PersonScreen";

const Stack = createNativeStackNavigator();

export default GroupScreen = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen  options={{ headerShown: false}} name="FirstView" component={FirstView}/>
            <Stack.Screen  options={{ headerShown: false}} name="SubView" component={SubView}/>
            <Stack.Screen  options={{ headerShown: false}} name="NewGroup" component={NewGroupView}/>
            <Stack.Screen  options={{ headerShown: false}} name="Person" component={PersonScreen}/>
        </Stack.Navigator>
    );
}

const FirstView = ({route, navigation}) => {
    return (
        <ScrollView>
            <GroupView route={route} navigation={navigation}></GroupView>
        </ScrollView>
    );
}

const SubView = ({route, navigation}) => {
    return (
        <ScrollView>
            <GroupView route={route} navigation={navigation}></GroupView>
            <View>
                <PersonsView route={route} navigation={navigation}></PersonsView>
            </View>
        </ScrollView>
    );
}