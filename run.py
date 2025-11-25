import app as main_module

app = main_module.create_app()

if __name__ == '__main__':
    app.run(
        debug=True,
        use_reloader=True,
    )
