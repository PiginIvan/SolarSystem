from flask import Flask, jsonify, request, send_from_directory 
import numpy as np

app = Flask(__name__, static_folder='static')

G = 4 * np.pi**2
def compute_gravitational_force(m1, m2, r):
    if r == 0:
        return 0
    return G * m1 * m2 / r**2

def calculate_accelerations(bodies):
    num_bodies = len(bodies)
    accelerations = np.zeros((num_bodies, 3), dtype=np.float64)  

    for i in range(num_bodies):
        for j in range(num_bodies):
            if i != j:
                position_i = np.array(bodies[i]['position'], dtype=np.float64)
                position_j = np.array(bodies[j]['position'], dtype=np.float64)
                distance_vector = position_j - position_i
                distance_magnitude = np.linalg.norm(distance_vector)

                if distance_magnitude > 0:
                    force = compute_gravitational_force(
                        float(bodies[i]['mass']), 
                        float(bodies[j]['mass']), 
                        distance_magnitude
                    )
                    acceleration = force / float(bodies[i]['mass']) * (distance_vector / distance_magnitude)
                    accelerations[i] += acceleration

    return accelerations.tolist()

@app.route('/<lang>.json')
def serve_translation(lang):
    return send_from_directory('.', f"{lang}.json")

@app.route('/update', methods=['POST'])
def update_positions():
    data = request.get_json()
    bodies = data['bodies']
    time_step = data.get('time_step', 1)  
    accelerations = calculate_accelerations(bodies)

    for i, body in enumerate(bodies):
        velocity = np.array(body['velocity']) + np.array(accelerations[i]) * time_step
        position = np.array(body['position']) + velocity * time_step

        body['velocity'] = velocity.tolist()
        body['position'] = position.tolist()

    return jsonify({'bodies': bodies})

@app.route('/')
def index():
    return send_from_directory('', 'index.html')

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')