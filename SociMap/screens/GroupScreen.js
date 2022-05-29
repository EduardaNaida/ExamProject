import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useEffect } from "react";
import { ScrollView, View, Text } from "react-native";
import GroupView from "../Pages/GroupView";
import NewGroupView from "../Pages/NewGroupView";
import PersonsView from "../Pages/PersonsView";
import PersonScreen from "./PersonScreen";
import AddExistingScreen from "./AddExistingScreen";

import globalStyle from '../assets/Stylesheet.js'

const Stack = createNativeStackNavigator();

export default GroupScreen = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: true,
            //headerTransparent: true,
            headerStyle: {
                backgroundColor: 'transparent',
            },
            headerShadowVisible: false,
            title: '',
            headerTintColor: '#fff',
        }}>
            <Stack.Screen name="FirstView" component={FirstView} />
            <Stack.Screen name="SubView" component={SubView} />
            <Stack.Screen name="NewGroup" component={NewGroupView} />
            <Stack.Screen name="Person" component={PersonScreen} />
            <Stack.Screen name="AddExistingPerson" component={AddExistingScreen} />
        </Stack.Navigator>
    );
}

const FirstView = ({ route, navigation }) => {
    return (
        <View style={{ flex: 1 }}>
            <Text style={globalStyle.header}>Groups</Text>
            <View style={globalStyle.container}>
                <ScrollView>
                    <GroupView route={route} navigation={navigation}></GroupView>
                </ScrollView>
            </View>
        </View>
    );
}

const SubView = ({ route, navigation }) => {
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTransparent: true,
            title: '',
            headerTintColor: '#fff',
        });
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <Text style={{ color: 'white', fontSize: 35, height: 100, lineHeight: 120, alignSelf: 'center', textAlign: 'center' }}>{route.params?.Title}</Text>
            <View style={{ flex: 1, alignSelf: 'stretch', backgroundColor: 'white', borderTopLeftRadius: 60, borderTopRightRadius: 60 }}>
                <ScrollView>
                    <GroupView route={route} navigation={navigation}></GroupView>
                    <PersonsView route={route} navigation={navigation} isChild={true}></PersonsView>
                </ScrollView>
            </View>
        </View>
    );
}