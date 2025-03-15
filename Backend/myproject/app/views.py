from django.shortcuts import render

#Create your views here.
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import ImageUpload
from .serializers import ImageUploadSerializer,RegisterUserSerializer
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
import pandas as pd
from django.middleware.csrf import get_token
from django.conf import settings
import os
from io import BytesIO
import pickle
import torch
from .predict import predict_image, DiseaseCNN  # Assuming prediction logic in a separate file
from django.views.decorators.csrf import csrf_exempt
from .train_model import CustomImageDataset, train, DiseaseCN
from torch.utils.data import DataLoader, Subset
import torch.optim as optim
from torch.optim.lr_scheduler import StepLR

from sklearn.model_selection import train_test_split
# Load the model once globally
device = torch.device('cpu')
model = DiseaseCNN()
model.load_state_dict(torch.load(
    r"C:\Users\AASHIK\Desktop\project model handeling\kernel_3_model_dict.pth",
    # r"C:/Users/AASHIK/Desktop/project model handeling/1/augumented_3000_dictionary.pth",
    map_location=device
))
model.to(device)

# @api_view(['POST'])
# def ImageUploadView(request):
#     user = request.user
#     serializer = ImageUploadSerializer(data=request.data)
#     if serializer.is_valid():
#         instance = serializer.save(user=request.user)
#         image_path = os.path.join(settings.MEDIA_ROOT, instance.image.name)
        
#         # Run prediction
#         predicted_label = predict_image(model, image_path)
#         instance.predicted_label = predicted_label
#         instance.save()
        
#         response_data = serializer.data
#         response_data['predicted_label'] = predicted_label
        
#         return Response(response_data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





@api_view(['POST'])
def ImageUploadView(request):
    user = request.user
    serializer = ImageUploadSerializer(data=request.data)
    if serializer.is_valid():
        instance = serializer.save(user=request.user)
        image_path = os.path.join(settings.MEDIA_ROOT, instance.image.name)
        
        # Run prediction
        predicted_label, confidence = predict_image(model, image_path)
        instance.predicted_label = predicted_label
        instance.confidence = confidence  # Assuming you added a confidence field
        instance.save()
        
        response_data = serializer.data
        response_data['predicted_label'] = predicted_label
        response_data['confidence'] = confidence
        
        return Response(response_data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# @api_view(['POST'])
# def ImageUploadView(request):
#     user = request.user
#     serializer = ImageUploadSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save(user=request.user)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def UserRegister(request):
      
      serializer=RegisterUserSerializer(data=request.data)
      if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def UserLogin(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        session_id = request.session.session_key
        print(session_id)
        return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid username or password'}, status=status.HTTP_400_BAD_REQUEST)



    
@api_view(['POST'])
def custom_logout_view(request):
    
    logout(request)
    return Response({'message': 'User logged out successfully'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@ensure_csrf_cookie
def csrf_token_view(request):
    #csrf_token = get_token(request)
    csrf_token = request.COOKIES.get('csrftoken')  
    # print(csrf_token)
    return JsonResponse({'csrfToken': csrf_token})



def logout_view(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({"message": "Logout successful."}, status=200)
    return JsonResponse({"error": "Invalid request method."}, status=400)



@api_view(['GET'])
def get_session_id(request):
    if request.method == 'GET':
        # Check if the user is authenticated
        if request.user.is_authenticated:
            # Get the session key
            session_key = request.session.session_key
            return JsonResponse({"sessionid": session_key}, status=200)
        else:
            return JsonResponse({"error": "User is not authenticated."}, status=401)

    return JsonResponse({"error": "Invalid request method."}, status=400)






@api_view(['GET'])
def UserImagesView(request):
        user_images = ImageUpload.objects.filter(user=request.user)
        serializer = ImageUploadSerializer(user_images, many=True)

        return Response(serializer.data)






# def get_processing_images(request):
#     image_folder = os.path.join(settings.MEDIA_ROOT, 'image_outputs')
    
#     if not os.path.exists(image_folder):
#         return JsonResponse({'images': []})  # Return empty if no images exist

#     image_files = sorted(os.listdir(image_folder), reverse=True)
#     image_urls = [settings.MEDIA_URL + 'image_outputs/' + img for img in image_files]

#     return JsonResponse({'images': image_urls})

def get_processing_images(request):
    image_folder = os.path.join(settings.MEDIA_ROOT, 'image_outputs')  # Path to images
    
    if not os.path.exists(image_folder):
        return JsonResponse({'images': []})  # Return empty if no images exist
    image_files = sorted(os.listdir(image_folder), reverse=True)  # Get latest images first
    # Create a list of dictionaries containing the image URL and its name
    image_urls = [
        {
            'url': settings.MEDIA_URL + 'image_outputs/' + img,
            'name': img
        }
        for img in image_files
    ]
    return JsonResponse({'images': image_urls})



@api_view(['GET'])
def get_metrics(request):
    file_path = os.path.join(settings.BASE_DIR, 'app', 'metrices', 'metrics.pkl')

    if not os.path.exists(file_path):
        return Response({'error': 'Metrics file not found'}, status=status.HTTP_404_NOT_FOUND)

    with open(file_path, 'rb') as f:
        metrics = pickle.load(f)

    return Response({'metrics': metrics}, status=status.HTTP_200_OK)


import json
def train_model(request):
    if request.method == 'POST':
        # Read JSON body
        form_data = json.loads(request.body)
        
        kernel_size = form_data.get('kernelSize')
        stride = form_data.get('stride')
        learning_rate = form_data.get('learningRate')
        gamma = form_data.get('gamma')
        num_epochs = form_data.get('numEpochs')

        print(kernel_size, stride, learning_rate, gamma, num_epochs)
        # Prepare dataset

        print("Data_set is being prepared")

        csv_file = r"C:\Users\AASHIK\Desktop\Plant_Disease_project\Backend\myproject\app\training_data\train1_augumanted_3000.csv" # Replace with the actual CSV file path
        dataset = CustomImageDataset(csv_file=csv_file, image_size=(128, 128))
        
        df = pd.read_csv(csv_file)
        labels = df['Label']

        # Splitting the dataset into training and validation
        train_indices, val_indices = train_test_split(range(len(labels)), test_size=0.2, stratify=labels)
        train_dataset = Subset(dataset, train_indices)
        val_dataset = Subset(dataset, val_indices)

        batch_size = 32
        dataloader_t = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
        dataloader_v = DataLoader(val_dataset, batch_size=batch_size, shuffle=True)
        print("Data_preperation complete")

        # Initialize the CNN model with dynamic kernel size and stride
        model = DiseaseCN(kernel_size=kernel_size, stride=stride)

        # Set up optimizer and scheduler
        criterion = torch.nn.CrossEntropyLoss()
        optimizer = optim.Adam(model.parameters(), lr=learning_rate, weight_decay=1e-4)
        scheduler = StepLR(optimizer, step_size=4, gamma=gamma)

        # # Train the model and get the metrics
        metrics = train(model, dataloader_t, dataloader_v, criterion, optimizer, scheduler, num_epochs)

        return JsonResponse(metrics)
        # return JsonResponse({"message": "Model training started."}, status=200)

    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)

    