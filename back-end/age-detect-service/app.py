import cv2
import math
import argparse
import numpy as np
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
CORS(app)

# Set up logging
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(levelname)s - %(message)s',
                    handlers=[logging.StreamHandler()])

app = Flask(__name__)

# Load the pre-trained models
faceProto = "opencv_face_detector.pbtxt"
faceModel = "opencv_face_detector_uint8.pb"
ageProto = "age_deploy.prototxt"
ageModel = "age_net.caffemodel"
genderProto = "gender_deploy.prototxt"
genderModel = "gender_net.caffemodel"
MODEL_MEAN_VALUES = (78.4263377603, 87.7689143744, 114.895847746)
ageList = ['(0-2)', '(4-6)', '(8-12)', '(15-20)', '(25-32)', '(38-43)', '(48-53)', '(60-100)']
genderList = ['Male', 'Female']

faceNet = cv2.dnn.readNet(faceModel, faceProto)
ageNet = cv2.dnn.readNet(ageModel, ageProto)
genderNet = cv2.dnn.readNet(genderModel, genderProto)

@app.route('/analyze', methods=['POST'])
def analyze_image():
    if 'image' not in request.files:
        logging.error("No image provided")
        return jsonify({'error': 'No image provided'}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        logging.error("No image selected")
        return jsonify({'error': 'No image selected'}), 400

    try:
        img_array = np.frombuffer(image_file.read(), np.uint8)
        frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        logging.info("Image received and decoded")

        result_img, face_boxes = highlightFace(faceNet, frame)
        if not face_boxes:
            logging.warning("No face detected")
            return jsonify({'error': 'No face detected'}), 404

        age_gender_results = []
        for face_box in face_boxes:
            face = frame[max(0, face_box[1] - 20): min(face_box[3] + 20, frame.shape[0] - 1),
                         max(0, face_box[0] - 20): min(face_box[2] + 20, frame.shape[1] - 1)]
            blob = cv2.dnn.blobFromImage(face, 1.0, (227, 227), MODEL_MEAN_VALUES, swapRB=False)

            genderNet.setInput(blob)
            gender_preds = genderNet.forward()
            gender = genderList[gender_preds[0].argmax()]

            ageNet.setInput(blob)
            age_preds = ageNet.forward()
            age = ageList[age_preds[0].argmax()]

            # Log the results for each detected face
            logging.info(f"Detected face - Gender: {gender}, Age: {age[1:-1]}")

            age_gender_results.append({
                'gender': gender,
                'age': age[1:-1]
            })

        return jsonify({
            'data': age_gender_results,
            'message': 'Analysis successful'
        })

    except Exception as e:
        logging.error(f"Error during image analysis: {str(e)}")
        return jsonify({'error': str(e)}), 500


def highlightFace(net, frame, conf_threshold=0.7):
    frameOpencvDnn = frame.copy()
    frameHeight = frameOpencvDnn.shape[0]
    frameWidth = frameOpencvDnn.shape[1]
    blob = cv2.dnn.blobFromImage(frameOpencvDnn, 1.0, (300, 300), [104, 117, 123], True, False)
    net.setInput(blob)
    detections = net.forward()
    face_boxes = []
    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > conf_threshold:
            x1 = int(detections[0, 0, i, 3] * frameWidth)
            y1 = int(detections[0, 0, i, 4] * frameHeight)
            x2 = int(detections[0, 0, i, 5] * frameWidth)
            y2 = int(detections[0, 0, i, 6] * frameHeight)
            face_boxes.append([x1, y1, x2, y2])
            cv2.rectangle(frameOpencvDnn, (x1, y1), (x2, y2), (0, 255, 0), int(round(frameHeight / 150)), 8)

    logging.info(f"Detected {len(face_boxes)} face(s)")
    return frameOpencvDnn, face_boxes


if __name__ == '__main__':
    logging.info("Starting Flask application")
    app.run(debug=True, host='0.0.0.0', port=3001)


# flask run --host=0.0.0.0 --port=3001