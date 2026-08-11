import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
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
  const [whatsInside, setWhatsInside] = useState(""); 
  const [sale, setSale] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // === NEW: Image States for up to 4 images ===
  const [imageFile1, setImageFile1] = useState(null);
  const [imageFile2, setImageFile2] = useState(null);
  const [imageFile3, setImageFile3] = useState(null);
  const [imageFile4, setImageFile4] = useState(null);

  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
  // Track existing images for editing
  const [existingImages, setExistingImages] = useState([]);


  // Add this next to const [sale, setSale] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);  // 11 Aug, 2026 flash lite  (for featured product)

 
  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

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

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setTitle(product.title);
    setOldPrice(product.oldPrice || "");
    setNewPrice(product.newPrice);
    setCategory(product.category);
    setDescription(product.description);
    setWhatsInside(product.whatsInside ? product.whatsInside.join('\n') : "");
    setSale(product.sale || false);

    setIsFeatured(product.isFeatured || false);    // featured product state

    // Load existing images into state (fallback to empty array if none)
    setExistingImages(product.images || [product.image]); 
    
    // Clear any new files selected
    setImageFile1(null); setImageFile2(null); setImageFile3(null); setImageFile4(null);
    window.scrollTo({ top: 0, behavior: "smooth" });


  };

  const resetForm = () => {
    setEditingId(null);
    setTitle(""); setOldPrice(""); setNewPrice(""); setDescription(""); setWhatsInside(""); 
    setCategory("Birthday"); setSale(false); 
    setExistingImages([]);
    setImageFile1(null); setImageFile2(null); setImageFile3(null); setImageFile4(null);

    setIsFeatured(false);  // feature pdt
  };

  // === NEW: Helper function to cleanly upload a single file to ImgBB ===
  const uploadToImgBB = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("image", file);
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { 
      method: "POST", 
      body: formData 
    });
    const data = await response.json();
    return data.data.url; // Returns the live URL
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Require at least the main image for new products
    if (!editingId && !imageFile1) {
      alert("Please choose at least a Main Image!");
      return;
    }

    setIsUploading(true); 
    try {
      // 1. Keep existing URLs if we are editing and they didn't pick a new file
      let url1 = existingImages[0] || "";
      let url2 = existingImages[1] || "";
      let url3 = existingImages[2] || "";
      let url4 = existingImages[3] || "";

      // 2. Upload any NEW files they selected
      if (imageFile1) url1 = await uploadToImgBB(imageFile1);
      if (imageFile2) url2 = await uploadToImgBB(imageFile2);
      if (imageFile3) url3 = await uploadToImgBB(imageFile3);
      if (imageFile4) url4 = await uploadToImgBB(imageFile4);

      // 3. Filter out any blank spots (in case they only uploaded 2 or 3 images)
      const finalImagesArray = [url1, url2, url3, url4].filter(url => url !== "");

      // 4. Format the What's Inside text
      const whatsInsideArray = whatsInside
        .split('\n')
        .map(item => item.trim())
        .filter(item => item !== "");

      const productData = {
        title, 
        category, 
        image: finalImagesArray[0], // Main cover image is always the first one
        images: finalImagesArray,   // The full gallery array
        oldPrice, 
        newPrice, 
        sale, 
        description,
        whatsInside: whatsInsideArray,

        isFeatured, // for feature product...
      };

      if (editingId) {
        await updateDoc(doc(db, "products", editingId), productData);
        alert("Product successfully updated!");
      } else {
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
      
      <div style={{ padding: "20px", background: editingId ? "#e6f7ff" : "#f9f9f9", border: editingId ? "2px solid #1890ff" : "none", borderRadius: "8px", marginBottom: "40px" }}>
        <h3>{editingId ? "✏️ Edit Product" : "➕ Add New Product"}</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: "8px" }}/>
          
          <div style={{ display: "flex", gap: "10px" }}>
            <input type="text" placeholder="New Price" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} required style={{ padding: "8px", flex: 1 }}/>
            <input type="text" placeholder="Old Price (Optional)" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} style={{ padding: "8px", flex: 1 }}/>
          </div>

          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: "8px" }}>
            <option value="Birthday">Birthday</option>
            <option value="Anniversary">Anniversary</option>
            <option value="Rakshabandhan">Rakshabandhan</option>
            <option value="Crochet Design">Crochet Design</option>
          </select>
          
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ padding: "8px", minHeight: "80px" }} />
          
          <textarea 
            placeholder="What's Inside? (Type each item on a new line)" 
            value={whatsInside} 
            onChange={(e) => setWhatsInside(e.target.value)} 
            style={{ padding: "8px", minHeight: "100px" }} 
          />
          
          {/* === NEW UI: 4 Image Upload Slots === */}
          <div style={{ padding: "15px", border: "1px dashed #ccc", background: "white", display: "flex", flexDirection: "column", gap: "15px" }}>
            <h4 style={{ margin: 0 }}>Product Images (Up to 4)</h4>
            
            <div>
              <label style={{ fontSize: "14px", fontWeight: "bold" }}>1. Main Cover Image {editingId ? "(Optional)" : "*"}</label>
              <input type="file" accept="image/*" onChange={(e) => setImageFile1(e.target.files[0])} required={!editingId} style={{ display: "block", marginTop: "5px" }} />
              {editingId && existingImages[0] && !imageFile1 && <span style={{ fontSize: "12px", color: "green" }}>Currently saved: {existingImages[0].substring(0, 30)}...</span>}
            </div>

            <div>
              <label style={{ fontSize: "14px" }}>2. Gallery Image (Optional)</label>
              <input type="file" accept="image/*" onChange={(e) => setImageFile2(e.target.files[0])} style={{ display: "block", marginTop: "5px" }} />
              {editingId && existingImages[1] && !imageFile2 && <span style={{ fontSize: "12px", color: "green" }}>Currently saved: {existingImages[1].substring(0, 30)}...</span>}
            </div>

            <div>
              <label style={{ fontSize: "14px" }}>3. Gallery Image (Optional)</label>
              <input type="file" accept="image/*" onChange={(e) => setImageFile3(e.target.files[0])} style={{ display: "block", marginTop: "5px" }} />
              {editingId && existingImages[2] && !imageFile3 && <span style={{ fontSize: "12px", color: "green" }}>Currently saved: {existingImages[2].substring(0, 30)}...</span>}
            </div>

            <div>
              <label style={{ fontSize: "14px" }}>4. Gallery Image (Optional)</label>
              <input type="file" accept="image/*" onChange={(e) => setImageFile4(e.target.files[0])} style={{ display: "block", marginTop: "5px" }} />
              {editingId && existingImages[3] && !imageFile4 && <span style={{ fontSize: "12px", color: "green" }}>Currently saved: {existingImages[3].substring(0, 30)}...</span>}
            </div>
          </div>

         {/* featured product... */}
          <label style={{ display: "flex", gap: "10px", alignItems: "center", cursor: "pointer", padding: "5px 0" }}>
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
            <strong style={{ color: "#D4813B" }}>⭐ Set as "Featured Product" (Homepage Banner)</strong>
          </label>

          <label style={{ display: "flex", gap: "10px", alignItems: "center", cursor: "pointer", padding: "10px 0" }}>
            <input type="checkbox" checked={sale} onChange={(e) => setSale(e.target.checked)} />
            <strong style={{ color: "#ff4d4d" }}>Mark as "On Sale"</strong>
          </label>
          
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" disabled={isUploading} style={{ flex: 1, padding: "12px", background: isUploading ? "gray" : (editingId ? "#1890ff" : "#333"), color: "white", cursor: isUploading ? "not-allowed" : "pointer", fontSize: "16px", fontWeight: "bold", border: "none", borderRadius: "4px" }}>
              {isUploading ? "Uploading Images & Saving..." : (editingId ? "Update Product" : "Add Product")}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} style={{ padding: "12px", background: "#eee", color: "#333", border: "1px solid #ccc", cursor: "pointer", borderRadius: "4px" }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h3>Manage Existing Products</h3>
        {products.length === 0 ? <p>No products found.</p> : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {products.map((product) => (
              <div key={product.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", border: "1px solid #eee", borderRadius: "5px", background: "white" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <img src={product.image} alt={product.title} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }} />
                  <div>
                    <strong>{product.title}</strong>

                     {/* FEatured product added for.. */}
                    {product.isFeatured && <span style={{ marginLeft: "8px", background: "#FFF3E0", color: "#D4813B", padding: "2px 6px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>⭐ Featured</span>}
                    
                    <div style={{ fontSize: "14px", color: "#666" }}>₹{product.newPrice} | {product.category} | {product.images?.length || 1} Images</div>
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