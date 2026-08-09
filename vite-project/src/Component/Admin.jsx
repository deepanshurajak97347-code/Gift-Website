import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore"; // 1. ADDED updateDoc
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "../firebase";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [category, setCategory] = useState("Birthday");
  const [description, setDescription] = useState("");
  const [sale, setSale] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [products, setProducts] = useState([]);
  
  // NEW: States to track if we are editing
  const [editingId, setEditingId] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");

  const IMGBB_API_KEY = "f21582ff8c2a31270c74dfb9131a0885";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const productsArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProducts(productsArray);
  };

  useEffect(() => {
    if (user) fetchProducts();
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Invalid email or password!");
    }
  };

  const handleLogout = async () => await signOut(auth);

  // NEW: Function to load product data into the form
  const handleEditClick = (product) => {
    setEditingId(product.id);
    setTitle(product.title);
    setOldPrice(product.oldPrice || "");
    setNewPrice(product.newPrice);
    setCategory(product.category);
    setDescription(product.description);
    setSale(product.sale || false);
    setExistingImageUrl(product.image); // Save the old image URL
    setImageFile(null); // Clear any newly selected files
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll up to the form
  };

  // NEW: Function to cancel editing
  const resetForm = () => {
    setEditingId(null);
    setTitle(""); setOldPrice(""); setNewPrice(""); setDescription(""); 
    setCategory("Birthday"); setSale(false); setExistingImageUrl(""); setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If adding new, image is required. If editing, it's optional.
    if (!editingId && !imageFile) {
      alert("Please choose an image to upload!");
      return;
    }

    setIsUploading(true); 
    try {
      let finalImageUrl = existingImageUrl;

      // Only upload to ImgBB if they actually selected a NEW image
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
        const imgbbData = await imgbbResponse.json();
        finalImageUrl = imgbbData.data.url;
      }

      const productData = {
        title, category, image: finalImageUrl, oldPrice, newPrice, sale, description,
        images: [finalImageUrl, "https://via.placeholder.com/600x800?text=More+Images+Soon"]
      };

      if (editingId) {
        // UPDATE EXISTING PRODUCT
        await updateDoc(doc(db, "products", editingId), productData);
        alert("Product successfully updated!");
      } else {
        // ADD NEW PRODUCT
        await addDoc(collection(db, "products"), productData);
        alert("New product added!");
      }

      resetForm();
      fetchProducts(); 
      
    } catch (error) {
      console.error("Error: ", error);
      alert("Failed to save product.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product forever?");
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, "products", id));
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      alert("Failed to delete product.");
    }
  };

  if (authLoading) return <div style={{ textAlign: "center", padding: "100px" }}>Loading...</div>;

  if (!user) {
    return (
      <div style={{ padding: "60px 20px", maxWidth: "400px", margin: "0 auto", fontFamily: "sans-serif" }}>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input type="email" placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: "10px", border: "1px solid #ccc" }}/>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: "10px", border: "1px solid #ccc" }}/>
          <button type="submit" style={{ padding: "10px", background: "#333", color: "white", cursor: "pointer" }}>Sign In</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout} style={{ padding: "6px 12px", background: "#ff4d4d", color: "white", border: "none", cursor: "pointer" }}>Logout</button>
      </div>
      
      {/* ADD / EDIT FORM */}
      <div style={{ padding: "20px", background: editingId ? "#e6f7ff" : "#f9f9f9", border: editingId ? "2px solid #1890ff" : "none", borderRadius: "8px", marginBottom: "40px" }}>
        <h3>{editingId ? "✏️ Edit Product" : "➕ Add New Product"}</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: "8px" }}/>
          <input type="text" placeholder="Old Price (Optional)" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} style={{ padding: "8px" }}/>
          <input type="text" placeholder="New Price" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} required style={{ padding: "8px" }}/>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: "8px" }}>
            <option value="Birthday">Birthday</option>
            <option value="Anniversary">Anniversary</option>
            <option value="Rakhi">Rakhi</option>
          </select>
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ padding: "8px", minHeight: "80px" }} />
          
          <div style={{ padding: "10px", border: "1px dashed #ccc", background: "white" }}>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
              {editingId ? "Change Image (Optional):" : "Upload Image:"}
            </label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required={!editingId} />
            {editingId && existingImageUrl && !imageFile && (
              <p style={{ fontSize: "12px", color: "gray", marginTop: "5px" }}>Current image will be kept.</p>
            )}
          </div>

          <label style={{ display: "flex", gap: "10px", alignItems: "center", cursor: "pointer" }}>
            <input type="checkbox" checked={sale} onChange={(e) => setSale(e.target.checked)} />
            Is this on Sale?
          </label>
          
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" disabled={isUploading} style={{ flex: 1, padding: "10px", background: isUploading ? "gray" : (editingId ? "#1890ff" : "#333"), color: "white", cursor: isUploading ? "not-allowed" : "pointer" }}>
              {isUploading ? "Saving..." : (editingId ? "Update Product" : "Add Product")}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} style={{ padding: "10px", background: "#eee", color: "#333", border: "1px solid #ccc", cursor: "pointer" }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* PRODUCT LIST */}
      <div>
        <h3>Manage Existing Products</h3>
        {products.length === 0 ? <p>No products found.</p> : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {products.map((product) => (
              <div key={product.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", border: "1px solid #eee", borderRadius: "5px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <img src={product.image} alt={product.title} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }} />
                  <div>
                    <strong>{product.title}</strong>
                    <div style={{ fontSize: "14px", color: "#666" }}>₹{product.newPrice} | {product.category}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => handleEditClick(product)} style={{ padding: "6px 12px", background: "white", color: "#1890ff", border: "1px solid #1890ff", borderRadius: "4px", cursor: "pointer" }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product.id)} style={{ padding: "6px 12px", background: "white", color: "#ff4d4d", border: "1px solid #ff4d4d", borderRadius: "4px", cursor: "pointer" }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}