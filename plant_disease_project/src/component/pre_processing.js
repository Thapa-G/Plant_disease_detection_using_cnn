import React, { useEffect, useState } from 'react';
import Footer from './Footer';
const Pre_processing = () => {
    return(
        <div>


            <div className='text-center'>
                
                <h1 className='text-xl font-semibold mt-10'>Analysis</h1>
                <div className=' flex justify-center mt-10 mb-5 gap-5'>
                    <img src='Images\before preprocessing\extensionsss.png' alt='HELLO' className=' w-2/5 h-auto' />
                    <img src='Images\before preprocessing\analysis.png' alt='HELLO' className='w-3/6' />
                   
                    </div>

            </div>
            {/* Augmentation image  */}


            <div className='text-center'>
                
                <h1 className='text-xl font-semibold mt-10'>Before Augmentation Samples</h1>
                <div className='flex justify-center mt-10 mb-5 gap-5'>
                    <img src='Images\augumented_image_samples\before\0a1655ed-797c-4d1d-ba35-dc255d68a2ee___GCREC_Bact.Sp 3560.JPG' alt='HELLO' className='w-32 h-32 ' />
                    <img src='Images/augumented_image_samples/before/00b7e89a-e129-4576-b51f-48923888bff9___GCREC_Bact.Sp 6202.JPG' alt='HELLO' className='w-32 h-32 ' />
                    <img src='Images\augumented_image_samples\before\0e94696b-3e0d-4d4c-a712-01197e228cf1___UF.GRC_BS_Lab Leaf 8641.JPG' alt='HELLO' className='w-32 h-32 ' />
                    <img src='Images\augumented_image_samples\before\0f4ce5ef-5ecf-4c5d-b301-3b5a44e3a1c8___UF.GRC_BS_Lab Leaf 0408.JPG' alt='HELLO' className='w-32 h-32 ' />
                    <img src='Images/augumented_image_samples/before/00f16858-f392-4d9e-ad9f-efab8049a13f___JR_Sept.L.S 8368_flipTB.JPG' alt='HELLO' className='w-32 h-32 ' />
                    </div>
                <h1 className='text-xl font-semibold'>After Augmentation Samples</h1>
                <div className='flex justify-center mt-5 gap-5'>
                <img src='Images/augumented_image_samples/after/0a1655ed-797c-4d1d-ba35-dc255d68a2ee___GCREC_Bact.Sp 3560_0_aug.jpg' alt='After Augmentation' className='w-32 h-32' />
                <img src='Images/augumented_image_samples/after/00b7e89a-e129-4576-b51f-48923888bff9___GCREC_Bact.Sp 6202_0_aug.jpg' alt='After Augmentation' className='w-32 h-32' />
                <img src='Images/augumented_image_samples/after/0e94696b-3e0d-4d4c-a712-01197e228cf1___UF.GRC_BS_Lab Leaf 8641_0_aug.jpg' alt='After Augmentation' className='w-32 h-32' />
                <img src='Images/augumented_image_samples/after/0f4ce5ef-5ecf-4c5d-b301-3b5a44e3a1c8___UF.GRC_BS_Lab Leaf 0408_0_aug.jpg' alt='After Augmentation' className='w-32 h-32' />
                <img src='Images/augumented_image_samples/after/00f16858-f392-4d9e-ad9f-efab8049a13f___JR_Sept.L.S 8368_flipTB_0_aug.jpg' alt='After Augmentation' className='w-32 h-32' />
                </div>

            </div>


            {/* prepocessed image  */}
            <div className='text-xl font-semibold text-center mt-10'>

                <h1>Before Preprocessing Samples</h1>
                <div className='flex justify-center mt-10 mb-5 gap-5'>
                <img src='Images/before preprocessing/00a7c269-3476-4d25-b744-44d6353cd921___GCREC_Bact.Sp 5807.JPG' alt='Before Preprocessing' className='w-32 h-32' />
                    <img src='Images/before preprocessing/0a6203b9-ced0-4934-ae23-4a7d2e2e2fdd___RS_Late.B 6424.JPG' alt='Before Preprocessing' className='w-32 h-32' />
                    <img src='Images/before preprocessing/00b7e89a-e129-4576-b51f-48923888bff9___GCREC_Bact.Sp 6202_0_aug.jpg' alt='Before Preprocessing' className='w-32 h-32' />
                    <img src='Images/before preprocessing/0e94696b-3e0d-4d4c-a712-01197e228cf1___UF.GRC_BS_Lab Leaf 8641_0_aug.jpg' alt='Before Preprocessing' className='w-32 h-32' />
                    <img src='Images/before preprocessing/6e8aef28-b9c4-4270-aa79-ca882d3b038e___UF.GRC_BS_Lab Leaf 9247.JPG' alt='Before Preprocessing' className='w-32 h-32' />
                </div>
                <h1>Preprocessed Image Samples</h1>
                <div className='flex justify-center mt-10 mb-5 gap-5'>
                <img src='Images/preprocessed_image_samples/00a7c269-3476-4d25-b744-44d6353cd921___GCREC_Bact.Sp 5807.JPG' alt='Preprocessed' className='w-32 h-32' />
                    <img src='Images/preprocessed_image_samples/0a6203b9-ced0-4934-ae23-4a7d2e2e2fdd___RS_Late.B 6424.JPG' alt='Preprocessed' className='w-32 h-32' />
                    <img src='Images/preprocessed_image_samples/00b7e89a-e129-4576-b51f-48923888bff9___GCREC_Bact.Sp 6202_0_aug.jpg' alt='Preprocessed' className='w-32 h-32' />
                    <img src='Images/preprocessed_image_samples/0e94696b-3e0d-4d4c-a712-01197e228cf1___UF.GRC_BS_Lab Leaf 8641_0_aug.jpg' alt='Preprocessed' className='w-32 h-32' />
                    <img src='Images/preprocessed_image_samples/6e8aef28-b9c4-4270-aa79-ca882d3b038e___UF.GRC_BS_Lab Leaf 9247.JPG' alt='Preprocessed' className='w-32 h-32' />
                </div>
            </div>
                        <footer className='bg-backgreen mt-10'>
        <Footer 
          image='Images/Artboard 2.svg' 
          name='TOMEX' 
          paragraph='Hey there, this section contains all the images you have predicted. We hope it helps. Thank you!' 
          Email='Aaasd34@gmail.com' 
          phone='+977 984755555' 
          Address='Baglung-Municipality' 
        />
      </footer>


        </div>
    )
};

export default Pre_processing;
