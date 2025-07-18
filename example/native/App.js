/**
 * Example of how to use @react-input-validator packages
 * https://github.com/atmulyana/react-input-validator
 */
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import Basic from './BasicPage';
import Auto from './AutoPage';
import setMessageFunc from './setMessageFuncPage';
import StatusIcon from './StatusIconPage';
import Compare from './ComparePage';

const pages = {
    Basic,
    Auto,
    setMessageFunc,
    "Status Icon": StatusIcon,
    Compare,
};

const App = () => {
    const [pageTitle, setPageTitle] = React.useState(Object.keys(pages)[0]);
    const Page = pages[pageTitle] ?? View;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.tabBar}>
                <ScrollView contentInsetAdjustmentBehavior="automatic" horizontal>
                    {Object.keys(pages).map(title => (
                        <TouchableOpacity 
                            key={title}
                            style={[
                                styles.pageTab,
                                title == pageTitle ? styles.pageTabHighlight : null
                            ]}
                            onPress={() => {
                                if (title == pageTitle) return;
                                setPageTitle(title);
                            }}
                        >
                            <Text style={styles.titleLink}>{title}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            <ScrollView
                contentContainerStyle={styles.pageContent}
                contentInsetAdjustmentBehavior="automatic"
                style={styles.container}
            >
                <Page />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    pageContent: {
        padding: 8,
    },
    pageTab: {
        backgroundColor: '#ccc',
        borderColor: 'gray',
        borderWidth: 1,
        height: 20,
        margin: 2,
    },
    pageTabHighlight: {
        backgroundColor: '#eee',
    },
    tabBar: {
        backgroundColor: '#aaa',
        flex: 0,
        height: 24,
    },
    titleLink: {
        color: 'blue',
        fontSize: 14,
        fontWeight: 'bold',
        lineHeight: 16,
        paddingHorizontal: 4,
        textDecorationLine: 'underline',
    },
});

export default App;
