'use client';
import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { Button } from '@nextui-org/button';

const ProfilePhotoUpload = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const auth = getAuth();


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file)); // Preview the selected image
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadStatus("Please select a file first.");
            return;
        }

        const currentUser = auth.currentUser;
        if (!currentUser) {
            setUploadStatus("User not logged in.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("email", currentUser.email || "");

            const response = await fetch("/api/uploadProfilePhoto", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setUploadStatus("Profile photo uploaded successfully!");

                // Force re-render of the profile photo with a new timestamp
                const timestamp = new Date().getTime();
                const email = currentUser.email || "";
                const newPhotoUrl = `/profile-photos/${email.replace("@", "_")}.jpg?timestamp=${timestamp}`;
                setPreview(newPhotoUrl); // Update preview if necessary
            } else {
                setUploadStatus("Failed to upload profile photo.");
            }
        } catch (error) {
            console.error("Error uploading profile photo:", error);
            setUploadStatus("An error occurred while uploading the photo.");
        }
    };

    return (
        <div className="profile-photo-upload">
            <div className='font-bold text-2xl mt-10 ml-5 mb-5'>Upload Profile Photo</div>
            <div className='w-screen'>
                <div className='w-full m-5'>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    {preview && <img src={preview} alt="Preview" style={{ maxWidth: '150px', margin: '10px 0' }} />}
                    <Button variant='ghost' onClick={handleUpload}>Upload</Button>
                    {uploadStatus && <p>{uploadStatus}</p>}
                </div>
            </div>
        </div>
    );
};

export default ProfilePhotoUpload;
