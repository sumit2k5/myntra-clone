import { useLocalSearchParams } from "expo-router";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Search, ChevronRight } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { Colors } from "@/constants/Colors";
import { useThemeContext } from "@/context/ThemeContext";

const categories = [
  {
    id: 1,
    name: "Men",
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Women",
    image:
      "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg",
  },
  {
    id: 3,
    name: "Kids",
    image:
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop",
  },
];

// const products = [
//   {
//     id: 1,
//     name: "Casual White T-Shirt",
//     brand: "Roadster",
//     price: "₹499",
//     discount: "60% OFF",
//     image:
//       "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop",
//   },
//   {
//     id: 2,
//     name: "Denim Jacket",
//     brand: "Levis",
//     price: "₹2499",
//     discount: "40% OFF",
//     image:
//       "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=500&auto=format&fit=crop",
//   },
//   {
//     id: 3,
//     name: "Summer Dress",
//     brand: "ONLY",
//     price: "₹1299",
//     discount: "50% OFF",
//     image:
//       "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&auto=format&fit=crop",
//   },
//   {
//     id: 4,
//     name: "Classic Sneakers",
//     brand: "Nike",
//     price: "₹3499",
//     discount: "30% OFF",
//     image:
//       "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop",
//   },
// ];
const { category } = useLocalSearchParams();

const deals = [
  {
    id: 1,
    title: "Under ₹599",
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "40-70% Off",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop",
  },
];

export default function Home() {
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [product, setproduct] = useState<any>(null);
  const [categories, setcategories] = useState<any>(null);
  const { user } = useAuth();
  const { theme } = useThemeContext();
  const colors = Colors[theme];
  const handleProductPress = (productId: number) => {
    if (!user) {
      router.push("/login");
    } else {
      router.push(`/product/${productId}`);
    }
  };
  useEffect(() => {
  const fetchproduct = async () => {
    try {
      setIsLoading(true);

      const cat = await axios.get("https://myntra-clone-2wac.onrender.com/category");
      const product = await axios.get("https://myntra-clone-2wac.onrender.com/product");

      setcategories(cat.data);
      setproduct(product.data);

      if (user) {
        const recent = await axios.get(
          `https://myntra-clone-2wac.onrender.com/recently-viewed/${user._id}`
        );

        console.log("Recent:", recent.data);

        setRecentlyViewed(recent.data);
      } else {
        setRecentlyViewed([]);
      }

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchproduct();
}, [user]);
  return (
    <ScrollView
  style={[
    styles.container,
    { backgroundColor: colors.background }
  ]}
>
      <View
  style={[
    styles.header,
    {
      backgroundColor: colors.background,
      borderBottomColor: colors.border,
    },
  ]}
>
        <Text
  style={[
    styles.logo,
    { color: colors.primary }
  ]}
>
  MYNTRA
</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop",
        }}
        style={styles.banner}
        resizeMode="cover"
      />

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text
  style={[
    styles.sectionTitle,
    { color: colors.text }
  ]}
>SHOP BY CATEGORY</Text>
          <TouchableOpacity style={styles.viewAll}>
            <Text
  style={[
    styles.viewAllText,
    { color: colors.primary }
  ]}
>
  View All
</Text>
            <ChevronRight size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.categoriesContainer}
>
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={styles.loader}
            />
          ) : !categories || categories.length === 0 ? (
            <Text style={styles.emptyText}>No categories available</Text>
          ) : (
            categories.map((category: any) => (
              <TouchableOpacity
  key={category._id}
  style={styles.categoryCard}
  onPress={() =>
    router.push({
      pathname: "/categories",
      params: {
        categoryId: category._id,
      },
    })
  }
>
                <Image
                  source={{ uri: category.image }}
                  style={styles.categoryImage}
                />
                <Text
  style={[
    styles.categoryName,
    { color: colors.text }
  ]}
>{category.name}</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text
  style={[
    styles.sectionTitle,
    { color: colors.text }
  ]}
>DEALS OF THE DAY</Text>
        </View>
        <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.dealsContainer}
>
          {deals.map((deal) => (
            <TouchableOpacity
  key={deal.id}
  style={styles.dealCard}
  onPress={() =>
    router.push({
      pathname: "/categories",
      params: {
        deal: deal.title,
      },
    })
  }
>
              <Image source={{ uri: deal.image }} style={styles.dealImage} />
              <View style={styles.dealOverlay}>
                <Text style={styles.dealTitle}>{deal.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
{user && recentlyViewed.length > 0 && (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text
        style={[
          styles.sectionTitle,
          { color: colors.text },
        ]}
      >
        RECENTLY VIEWED
      </Text>
    </View>

    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoriesScroll}
    >
      {recentlyViewed.map((item: any) => (
        <TouchableOpacity
          key={item._id}
          style={styles.categoryCard}
          onPress={() =>
            handleProductPress(item.productId._id)
          }
        >
          <Image
            source={{
              uri: item.productId.images[0],
            }}
            style={styles.categoryImage}
          />

          <Text
            style={[
              styles.categoryName,
              { color: colors.text },
            ]}
          >
            {item.productId.brand}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
)}
      <View style={styles.section}>
        <View
  style={{
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 20,
  }}
>
  <Text
    style={[
      styles.sectionTitle,
      { color: colors.text }
    ]}
  >
    TRENDING NOW
  </Text>
</View>
        <View style={styles.productsGrid}>
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={styles.loader}
            />
          ) : !product || product.length === 0 ? (
            <Text
  style={[
    styles.emptyText,
    { color: colors.text }
  ]}
>No Product available</Text>
          ) : ( 
            <View style={styles.productsGrid}>
              {product.map((product: any) => (
                <TouchableOpacity
                  key={product._id}
                  style={[
  styles.productCard,
  { backgroundColor: colors.card }
]}
                  onPress={() => handleProductPress(product._id)}
                >
                  <Image
                    source={{ uri: product.images[0
                      
                    ] }}
                    style={styles.productImage}
                  />
                  <View style={styles.productInfo}>
                    <Text
  style={[
    styles.brandName,
    { color: colors.text }
  ]}
>{product.brand}</Text>
                    <Text
  style={[
    styles.productName,
    { color: colors.text }
  ]}
>{product.name}</Text>
                    <View style={styles.priceRow}>
                      <Text
  style={[
    styles.productPrice,
    { color: colors.text }
  ]}
>{product.price}</Text>
                      <Text
  style={[
    styles.discount,
    { color: colors.primary }
  ]}
>{product.discount}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#2d2d2d",
    position: "relative",
  },

  logo: {
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 2,
  },

  searchButton: {
    position: "absolute",
    right: 20,
    top: 18,
    padding: 10,
  },

  banner: {
    width: "96%",
    height: 320,
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 22,
  },

  section: {
    marginTop: 35,
    paddingHorizontal: 20,
  },

 sectionHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
},

 sectionTitle: {
  fontSize: 24,
  fontWeight: "900",
  textAlign: "left",
},

  viewAll: {
    flexDirection: "row",
    alignItems: "center",
  },

  viewAllText: {
    color: "#ff3f6c",
    fontWeight: "700",
    marginRight: 4,
  },

  emptyText: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
  },

  loader: {
    marginTop: 50,
  },

  categoriesScroll: {
    paddingVertical: 10,
  },

  categoryCard: {
    width: 140,
    alignItems: "center",
    marginHorizontal: 10,
  },

  categoryImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  categoryName: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },

  dealsScroll: {
    paddingVertical: 10,
  },

  dealCard: {
    width: 380,
    height: 220,
    borderRadius: 20,
    marginRight: 18,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  dealImage: {
    width: "100%",
    height: "100%",
  },

  dealOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 18,
  },

  dealTitle: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 24,
  },

  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },

  productCard: {
    width: "46%",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 24,
    backgroundColor: "#fff",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  productImage: {
    width: "100%",
    height: 260,
  },

  productInfo: {
    padding: 15,
  },

  brandName: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 3,
  },

  productName: {
    fontSize: 15,
    marginBottom: 8,
    lineHeight: 20,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  productPrice: {
    fontSize: 18,
    fontWeight: "900",
  },

  discount: {
    fontSize: 14,
    color: "#ff3f6c",
    fontWeight: "700",
  },
  categoriesContainer: {
  paddingHorizontal: 20,
  justifyContent: "center",
  alignItems: "center",
},
dealsContainer: {
  paddingHorizontal: 20,
  alignItems: "center",
},
});