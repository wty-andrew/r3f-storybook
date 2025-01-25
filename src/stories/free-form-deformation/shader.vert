attribute vec3 parametricPosition;

uniform vec3[125] u_controlPoints;
uniform int u_l;
uniform int u_m;
uniform int u_n;

float combinations(int n, int k) {
  if (k > n || k < 0 || n < 0) {
    return 0.0;
  }

  if (k > n - k) {
    k = n - k;
  }

  float result = 1.0;
  for (int i = 0; i < k; i++) {
    result *= float(n - i) / float(i + 1);
  }
  return result;
}

float bernstein(int n, int k, float x) {
  return combinations(n, k) * pow(1.0 - x, float(n - k)) * pow(x, float(k));
}

void main() {
  int length = u_m + 1;
  int height = u_n + 1;

  vec3 newPosition = vec3(0.0);
  for (int i = 0; i <= u_l; i++) {
    for (int j = 0; j <= u_m; j++) {
      for (int k = 0; k <= u_n; k++) {
        float weight = bernstein(u_l, i, parametricPosition[0]) *
                       bernstein(u_m, j, parametricPosition[1]) *
                       bernstein(u_n, k, parametricPosition[2]);
        int index = i * length * height + j * height + k;
        newPosition += u_controlPoints[index] * weight;
      }
    }
  }

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
