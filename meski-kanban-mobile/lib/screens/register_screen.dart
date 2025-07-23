import 'package:flutter/material.dart';
import 'package:meski_kanban_mobile/screens/login_screen.dart';
import 'package:meski_kanban_mobile/widgets/custom_button.dart';
import 'package:meski_kanban_mobile/widgets/custom_input.dart';
import 'package:meski_kanban_mobile/services/api_service.dart';

class RegisterScreen extends StatefulWidget {
  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final nameController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  void handleRegister() async {
    final name = nameController.text.trim();
    final email = emailController.text.trim();
    final password = passwordController.text.trim();

    if (name.isEmpty || email.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Lütfen tüm alanları doldurun")));
      return;
    }

    final result = await ApiService.register(name, email, password);

    print("REGISTER RESULT: $result"); // DEBUG

    if (result != null && result['user'] != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz"),
        ),
      );

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => LoginScreen()),
      );
    } else {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Kayıt başarısız")));
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
                  'MESKİ Kanban Kayıt',
                  style: TextStyle(fontSize: 24, color: Color(0xFF006eae)),
                ),
                SizedBox(height: 24),
                CustomInput(controller: nameController, hintText: 'İsim'),
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
                CustomButton(text: 'Kayıt Ol', onPressed: handleRegister),
                SizedBox(height: 12),
                TextButton(
                  onPressed: () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (_) => LoginScreen()),
                    );
                  },
                  child: Text('Zaten hesabınız var mı? Giriş Yap'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
