# Android Studio

O projeto Android foi criado com Capacitor 8 na pasta `android`, com identificador `br.com.meudinheiro.app`. O banco continua sendo o mesmo Supabase configurado no `.env`.

## Abrir e executar

Requisitos: Node 22+, Android Studio 2025.2.1 ou superior, SDK Android 36 e JDK compatível com o Gradle do projeto (use o JDK incluído no Android Studio).

Na raiz do projeto, depois de instalar as dependências e configurar `.env`:

```powershell
npm run android:sync
npm run android:open
```

No Android Studio:

1. Abra a pasta `android` e aguarde a sincronização do Gradle. Permita os downloads dos componentes solicitados pelo SDK Manager.
2. Escolha um emulador no Device Manager ou conecte um celular com depuração USB habilitada e autorizada.
3. Selecione a configuração `app` e clique em Run (triângulo verde).

O aplicativo usa os arquivos compilados em `dist`, sem depender do servidor `npm run dev`. Precisa de internet para acessar o Supabase. Ao alterar o código Vue ou o `.env`, execute `npm run android:sync` e rode novamente no dispositivo.

## Autenticação

Com confirmação de e-mail desativada, o cadastro e login usam e-mail/senha normalmente. A confirmação por link no Android exigirá configurar deep links e retorno ao aplicativo antes de habilitá-la para uso nativo; o retorno por URL web existente atende ao navegador.

## Verificação desta preparação

TypeScript e build web passaram; a plataforma Android foi criada e os arquivos web foram copiados com sucesso. O Android Studio foi iniciado com o projeto. Ainda é necessário concluir o Gradle e executar no emulador/celular para validar a compilação nativa e o comportamento no dispositivo. Nenhum APK foi gerado nesta etapa.

Referências: https://capacitorjs.com/docs/android e https://capacitorjs.com/docs/getting-started/environment-setup.
