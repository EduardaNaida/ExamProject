/**
 *  Project style sheets for common styles 
 */
import { StyleSheet } from 'react-native';

// TODO: change folder --> ./assets? 
export default StyleSheet.create({
    container: {
      flex: 1
    },
    welcome: {
      fontSize: 20
    },
    button: {
        fontSize: 12,
        color: '#000',
    },
  });

/** 
 * Use like this: 
 * import styles from './{path}/styles';
 *      <View
            style={styles.container}>
            <Button
                style={styles.button}
                title="Go to Lucy's profile"
            />
        </View>
 */