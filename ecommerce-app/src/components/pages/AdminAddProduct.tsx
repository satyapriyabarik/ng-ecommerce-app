
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_PRODUCT } from '../../graphql/mutations';
import { useNavigate } from 'react-router-dom';
import { LOCAL_S3_SERVER_URL, S3_FILE_PATH } from '../../constants';

export default function AdminAddProduct() {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [category, setCategory] = useState('');
    const [descriptions, setDescriptions] = useState('');
    const [createProduct] = useMutation(CREATE_PRODUCT);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const uploadToS3 = async () => {
        if (!imageFile) throw new Error('No image file selected');
        const res = await fetch(
            LOCAL_S3_SERVER_URL + `=${encodeURIComponent(imageFile.name)}`
        );
        const { url, key } = await res.json();
        await fetch(url, {
            method: 'PUT', headers: {
                'Content-Type': imageFile.type,
            }, body: imageFile
        });
        return S3_FILE_PATH + `/${key}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const imageUrl = await uploadToS3();
            await createProduct({
                variables: {
                    title,
                    price: parseFloat(price),
                    imageUrl,
                    category,
                    descriptions,
                },
            });
            // setTimeout(() => {
            //     navigate('/home');
            // }, 200);
        } catch (err) {
            console.error('Error creating product:', err);
            alert('Failed to create product.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container py-5 position-relative">
            <h4 className="mb-1 mt-2 animate__animated animate__flip animate__flipInY text-mted text-info">Add New Product</h4>
            <hr />
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="row g-3">
                    <div className="col-md-6">
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Product Title"
                            required
                            className="form-control"
                        />
                    </div>

                    <div className="col-md-6">
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Price"
                            required
                            className="form-control"
                        />
                    </div>

                    <div className="col-md-6">
                        <select
                            className="form-select"
                            onChange={(e) => setCategory(e.target.value)}
                            value={category}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="electronics">Electronics</option>
                            <option value="clothing">Clothing</option>
                            <option value="books">Books</option>
                            <option value="home">Home</option>
                            <option value="toys">Toys</option>
                        </select>
                    </div>

                    <div className="col-md-6">
                        <input
                            type="file"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setImageFile(e.target.files[0]);
                                } else {
                                    setImageFile(null);
                                }
                            }}
                            required
                            className="form-control"
                        />
                    </div>

                    <div className="col-12">
                        <textarea
                            className="form-control"
                            placeholder="Product Description"
                            rows={4}
                            onChange={(e) => setDescriptions(e.target.value)}
                            value={descriptions}
                            required
                        />
                    </div>

                    <div className="col-12 text-end">
                        <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                            {isSubmitting ? 'Adding...' : 'Add Product'}
                        </button>
                    </div>
                </div>
            </form>

            {/* Bootstrap Backdrop + Spinner */}
            {isSubmitting && (
                <div
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.75)', zIndex: 1050 }}
                >
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <div className="mt-2 fw-semibold">Uploading & Saving...</div>
                    </div>
                </div>
            )}
        </div>
    );
}

