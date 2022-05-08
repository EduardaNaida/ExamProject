import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import { Portal } from "@gorhom/portal";

const { width: layoutWidth, height: layoutHeight } = Dimensions.get("window");

const Menu = ({ trigger, children }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const triggerWrapperRef = useRef(null);
  const itemsWrapperRef = useRef(null);

  const styles = StyleSheet.create({
    modalWrapper: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 10,
      backgroundColor: "red",
    },
    activeSection: {
      backgroundColor: "white",
      alignSelf: "flex-start",
      zIndex: 99,
    }
  });

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Pressable
        onPress={() => {
          setModalVisible(true);
        }}
        ref={triggerWrapperRef}
      >
        {trigger}
      </Pressable>
      {modalVisible && (
        <Portal hostName="menu">
          <TouchableOpacity
            activeOpacity={1}
            onPress={closeModal}
            style={styles.modalWrapper}
          >
            <View 
              ref={itemsWrapperRef} 
              style={styles.activeSection}
              // for android as the ref may not return the item position
              collapsable={false}
              >
            {/* pass the closeModal to children prop  */}
            {Array.isArray(children)
              ? children.map((childrenItem) => {
                  return React.cloneElement(childrenItem, {
                    closeModal,
                  });
                })
              : React.cloneElement(children, {
                  closeModal,
                })}
            </View>
          </TouchableOpacity>
        </Portal>
      )}
    </>
  );
};

export const MenuItem = ({ text, onPress, closeModal }) => {
  const styles = StyleSheet.create({
    body: {
      padding: 10,
    },
  });

  const handleOnPress = () => {
    onPress();
    closeModal();
  };

  return (
    <>
      <Pressable onPress={handleOnPress} style={styles.body}>
        <Text numberOfLines={1}>{text}</Text>
      </Pressable>
    </>
  );
};

export default Menu;