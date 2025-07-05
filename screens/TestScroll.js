import { useEffect } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

const TestScroll = () => {
  useEffect(() => {
    // Force scrolling CSS for web
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      // Remove any existing style
      const existingStyle = document.getElementById('force-scroll-style');
      if (existingStyle) {
        existingStyle.remove();
      }

      // Add new style
      const style = document.createElement('style');
      style.id = 'force-scroll-style';
      style.textContent = `
        html, body {
          height: 100% !important;
          overflow: auto !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        #root, #main {
          height: 100% !important;
          overflow: auto !important;
        }
        
        /* Force all ScrollViews to scroll */
        div[data-focusable="true"],
        .rn-scrollview,
        [data-testid*="scroll"] {
          overflow: auto !important;
          -webkit-overflow-scrolling: touch !important;
          height: 100% !important;
        }
        
        /* Expo specific fixes */
        .expo-web-container {
          height: 100% !important;
          overflow: auto !important;
        }
      `;
      document.head.appendChild(style);
      
      console.log('CSS scroll fix applied!');
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>SCROLL TEST - Should see 50 items</Text>
      
      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        scrollEnabled={true}
        nestedScrollEnabled={true}
      >
        {/* Generate 50 items */}
        {Array.from({ length: 50 }, (_, i) => (
          <View key={i} style={styles.item}>
            <Text style={styles.itemText}>Item {i + 1}</Text>
            <Text>This is test content that should scroll. If you can see item 50, scrolling works!</Text>
            <Text>Current item: {i + 1} of 50</Text>
          </View>
        ))}
        
        <View style={styles.endMarker}>
          <Text style={styles.endText}>🎉 END OF LIST - Item 50 🎉</Text>
          <Text>If you can see this, scrolling is working!</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 18,
    padding: 15,
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  scroll: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    paddingBottom: 50,
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    minHeight: 100,
    backgroundColor: i => i % 2 === 0 ? '#f9f9f9' : 'white',
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  endMarker: {
    padding: 30,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    margin: 20,
    borderRadius: 10,
  },
  endText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
});

export default TestScroll;