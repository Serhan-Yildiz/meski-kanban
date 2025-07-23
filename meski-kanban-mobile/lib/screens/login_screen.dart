import 'package:flutter/material.dart';
import 'package:meski_kanban_mobile/screens/dashboard_screen.dart';
import 'package:meski_kanban_mobile/screens/register_screen.dart';
import 'package:meski_kanban_mobile/services/api_service.dart';
import 'package:meski_kanban_mobile/widgets/custom_button.dart';
import 'package:meski_kanban_mobile/widgets/custom_input.dart';

class LoginScreen extends StatefulWidget {
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  void handleLogin() async {
  final email = emailController.text.trim();
  final password = passwordController.text.trim();
  if (email.isEmpty || password.isEmpty) return;

  final result = await ApiService.login(email, password);
  if (result != null && result['token'] != null) {
    // Giriş başarılı → Token saklanabilir
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => DashboardScreen()),
    );
  } else {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text("Giriş başarısız")),
    );
  }
}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32.0),
        child: Center(
          child: SingleChildScrollView(
            child: Column(
              children: [
                Text(
                  'MESKİ Kanban Giriş',
                  style: TextStyle(fontSize: 24, color: Color(0xFF006eae)),
                ),
                SizedBox(height: 24),
                CustomInput(
                  controller: emailController,
                  hintText: 'E-posta',
                  keyboardType: TextInputType.emailAddress,
                ),
                CustomInput(
                  controller: passwordController,
                  hintText: 'Şifre',
                  obscureText: true,
                ),
                SizedBox(height: 16),
                CustomButton(text: 'Giriş Yap', onPressed: handleLogin),
                SizedBox(height: 12),
                TextButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => RegisterScreen()),
                    );
                  },
                  child: Text('Hesabınız yok mu? Kayıt Ol'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
