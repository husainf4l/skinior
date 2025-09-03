import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  title: string;
  children?: React.ReactNode;
}

const CustomComponent: React.FC<Props> = ({ title, children }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CustomComponent;
