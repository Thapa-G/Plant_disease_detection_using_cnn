import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import pandas as pd
from torchvision import transforms

class CustomImageDataset(Dataset):
    def __init__(self, csv_file, image_size=(128, 128), transform=None):
        self.data_frame = pd.read_csv(csv_file)
        self.transform = transform
        self.image_size = image_size

    def __len__(self):
        return len(self.data_frame)

    def __getitem__(self, idx):
        label = int(self.data_frame.iloc[idx, -1])
        pixels = self.data_frame.iloc[idx, :-1].values.astype('float32')
        image = pixels.reshape(self.image_size)
        image = torch.tensor(image).unsqueeze(0)
        image = image / 255.0  # Normalize
        if self.transform:
            image = self.transform(image)
        return image, label

data_transforms = transforms.Compose([
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomRotation(20),
])

class DiseaseCN(nn.Module):
    def __init__(self, kernel_size, stride):
        super(DiseaseCN, self).__init__()
        self.model = nn.Sequential(
            nn.Conv2d(1, 32, kernel_size=kernel_size, stride=stride, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),
            nn.Conv2d(32, 64, kernel_size=kernel_size, stride=stride, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),
            nn.Conv2d(64, 128, kernel_size=kernel_size, stride=stride, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),
            nn.Flatten(),
            nn.Linear(128 * 16 * 16, 512),
            nn.Dropout(0.1),
            nn.ReLU(),
            nn.Linear(512, 11)  # Output layer for 11 classes
        )

    def forward(self, x):
        return self.model(x)

def train(model, dataloader_t, dataloader_v, criterion, optimizer, scheduler, num_epochs):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model.to(device)
    train_losses = []
    val_losses = []
    val_accuracies = []
    precisions = []
    recalls = []
    f1_scores = []
    
    print(device)
    for epoch in range(num_epochs):
        model.train()
        running_loss = 0.0
        total_train_loss = 0.0

        for i, (inputs, labels) in enumerate(dataloader_t):
            inputs, labels = inputs.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            running_loss += loss.item()
            total_train_loss += loss.item()
            if i % 100 == 99:
                print(f'Epoch [{epoch + 1}/{num_epochs}], Step [{i + 1}/{len(dataloader_t)}], Loss: {running_loss / 100:.4f}')
                running_loss = 0.0

        train_losses.append(total_train_loss/ len(dataloader_t))
        
        # Validation phase
        model.eval()
        val_loss = 0.0
        correct = 0
        total = 0
        all_preds = []
        all_labels = []
        
        with torch.no_grad():
            for inputs, labels in dataloader_v:
                inputs, labels = inputs.to(device), labels.to(device)
                outputs = model(inputs)
                loss = criterion(outputs, labels)
                val_loss += loss.item()

                _, predicted = torch.max(outputs, 1)
                total += labels.size(0)
                correct += (predicted == labels).sum().item()
                all_preds.extend(predicted.cpu().numpy())
                all_labels.extend(labels.cpu().numpy())
    


        avg_val_loss = val_loss / len(dataloader_v)
        accuracy = 100 * correct / total
        precision = precision_score(all_labels, all_preds, average='macro')
        recall = recall_score(all_labels, all_preds, average='macro')
        val_losses.append(avg_val_loss)
        f1_v = 2 * (precision * recall) / (precision + recall) if precision + recall != 0 else 0
        f1_scores.append(f1_v)
        # Compute metrics
        val_accuracies.append(accuracy)
        precisions.append(precision)
        recalls.append(recall)
        
        print(f'Epoch [{epoch + 1}/{num_epochs}] - Validation Loss: {avg_val_loss:.4f}, Validation Accuracy: {accuracy:.2f}%')
        print(f'Precision: {precision:.4f}, Recall: {recall:.4f}, F1-Score: {f1_v:.4f}')



        scheduler.step()

       
    metrics = {
        "epoch": list(range(1, num_epochs + 1)),
        "train_loss": train_losses,
        "val_loss": val_losses,
        "accuracy": val_accuracies,
        "precision": precisions,
        "recall": recalls,
        "f1_score": f1_scores
    }
    return metrics
