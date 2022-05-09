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
            <Stack.Screen name="FirstView" component={FirstView}/>
            <Stack.Screen name="SubView" component={SubView}/>
            <Stack.Screen name="NewGroup" component={NewGroupView}/>
            <Stack.Screen name="Person" component={PersonScreen}/>
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
        <ScrollView style={{backgroundColor:'white', flex:1}}>
            <View>
                <GroupView route={route} navigation={navigation}></GroupView>
            </View>
            <View style={{flex:1, alignSelf:'stretch'}}>
                <PersonsView route={route} navigation={navigation}></PersonsView>
            </View>
        </ScrollView>
    );
}