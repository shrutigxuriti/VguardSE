import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../colors';

interface DeliveryStatusProps {
  statuses: string[];
  activeStatusIndex: number;
}

const DeliveryStatus: React.FC<DeliveryStatusProps> = ({ statuses, activeStatusIndex }) => {
  return (
    <View style={styles.tracker}>
      {statuses.map((status, index) => {
        const isCompleted = index < activeStatusIndex;
        const isActive = index === activeStatusIndex;
        const circleStyle = [
          styles.circle,
          isCompleted ? styles.completedCircle : isActive ? styles.activeCircle : null,
        ];

        const lineStyle = [styles.line, isCompleted ? styles.completedLine : styles.pendingLine];

        return (
          <View key={index} style={styles.statusContainer}>
            <View style={styles.statusInfo}>
              <View style={circleStyle} />
              <Text style={[styles.statusText, isActive ? styles.activeText : isCompleted ? styles.completedText : null]}>{status}</Text>
            </View>
            {index < statuses.length - 1 && <View style={lineStyle} />}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tracker: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  statusContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  completedCircle: {
    backgroundColor: 'black',
  },
  activeCircle: {
    backgroundColor: colors.yellow,
  },
  line: {
    marginLeft: 8,
    width: 2,
    height: 30,
    backgroundColor: '#ccc',
  },
  completedLine: {
    backgroundColor: colors.yellow,
  },
  pendingLine: {
    backgroundColor: '#ccc',
  },
  statusText: {
    color: '#ccc',
    marginLeft: 10,
  },
  completedText: {
    color: 'black',
  },
  activeText: {
    color: colors.black,
    fontWeight: 'bold'
  },
});

export default DeliveryStatus;
