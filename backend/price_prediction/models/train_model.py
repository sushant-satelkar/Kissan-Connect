import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error
import joblib
import os

# Set paths
current_dir = os.path.dirname(os.path.abspath(__file__))
data_dir = os.path.join(os.path.dirname(current_dir), 'data')
model_dir = current_dir

def train_model():
    # Load the data - using the absolute path provided
    data_path = "D:/Devanshu/Projects/Farmer Consumer website/crop_price_prediction_200_records.csv"
    data = pd.read_csv(data_path)
    
    # Display basic info
    print("Dataset shape:", data.shape)
    print("\nFirst few rows:")
    print(data.head())
    print("\nData Info:")
    print(data.info())
    print("\nMissing values:")
    print(data.isnull().sum())
    
    # Handle missing values if any
    # For numeric columns, fill with median
    numeric_cols = data.select_dtypes(include=['int64', 'float64']).columns
    for col in numeric_cols:
        if data[col].isnull().sum() > 0:
            data[col].fillna(data[col].median(), inplace=True)
    
    # For categorical columns, fill with mode
    categorical_cols = data.select_dtypes(include=['object']).columns
    for col in categorical_cols:
        if data[col].isnull().sum() > 0:
            data[col].fillna(data[col].mode()[0], inplace=True)
    
    # Define features and target
    X = data.drop('price', axis=1) if 'price' in data.columns else data.drop(data.columns[-1], axis=1)
    y = data['price'] if 'price' in data.columns else data[data.columns[-1]]
    
    # Identify numeric and categorical columns
    numeric_features = X.select_dtypes(include=['int64', 'float64']).columns.tolist()
    categorical_features = X.select_dtypes(include=['object']).columns.tolist()
    
    # Print features info
    print(f"\nNumeric features: {numeric_features}")
    print(f"Categorical features: {categorical_features}")
    print(f"Target variable: {y.name}")
    
    # Create preprocessing pipeline
    numeric_transformer = Pipeline(steps=[
        ('scaler', StandardScaler())
    ])
    
    categorical_transformer = Pipeline(steps=[
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ])
    
    # Create the model pipeline
    model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
    ])
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train the model
    print("\nTraining the model...")
    model.fit(X_train, y_train)
    
    # Evaluate the model
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    print(f"\nModel Evaluation:")
    print(f"Mean Absolute Error: {mae:.2f}")
    
    # Feature importance
    feature_names = numeric_features + list(model.named_steps['preprocessor']
                                         .named_transformers_['cat']
                                         .named_steps['onehot']
                                         .get_feature_names_out(categorical_features))
    
    importances = model.named_steps['regressor'].feature_importances_
    indices = np.argsort(importances)[::-1]
    
    print("\nFeature Importance:")
    for i in range(min(10, len(feature_names))):
        try:
            print(f"{i+1}. {feature_names[indices[i]]}: {importances[indices[i]]:.4f}")
        except:
            print(f"Error printing feature {i}")
    
    # Save the model
    model_path = os.path.join(model_dir, 'crop_price_model.joblib')
    joblib.dump(model, model_path)
    print(f"\nModel saved to {model_path}")
    
    # Save feature column names for inference
    feature_columns = {
        'numeric_features': numeric_features,
        'categorical_features': categorical_features
    }
    
    feature_columns_path = os.path.join(model_dir, 'feature_columns.joblib')
    joblib.dump(feature_columns, feature_columns_path)
    print(f"Feature columns saved to {feature_columns_path}")
    
    return model, mae

if __name__ == "__main__":
    train_model() 